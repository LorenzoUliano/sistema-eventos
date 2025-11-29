<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderTicket;
use App\Models\Ticket;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderService
{
    /**
     * Cria uma ordem e seus ingressos a partir de um pagamento Pix confirmado.
     * @param array $pixPaymentData Estrutura com chaves: id, amount, purchaseData
     */
    public function createOrderFromPix(array $pixPaymentData)
    {
        $purchaseData = $pixPaymentData['purchaseData'];
        $pixPaymentId = $pixPaymentData['id'];
        $clientAmount = $pixPaymentData['amount'];

        // Recalcular total server-side para evitar manipulação
        $recalculatedTotal = 0;
        $ticketsRequested = [];
        foreach ($purchaseData['tickets'] as $t) {
            $ticketModel = Ticket::findOrFail($t['ticketTypeId']);
            $quantity = max(1, (int) ($t['quantity'] ?? 1));

            $lineTotal = $ticketModel->price * $quantity;
            $recalculatedTotal += $lineTotal;
            $ticketsRequested[] = [
                'model' => $ticketModel,
                'quantity' => $quantity,
                'line_total' => $lineTotal,
            ];
        }

        if (abs($recalculatedTotal - $clientAmount) > 0.01) {
            Log::warning('Valor divergente no pagamento Pix', [
                'pix_payment_id' => $pixPaymentId,
                'server_total' => $recalculatedTotal,
                'client_total' => $clientAmount,
            ]);
            throw new \RuntimeException('Valor do pagamento inválido.');
        }

        return DB::transaction(function () use ($purchaseData, $pixPaymentId, $recalculatedTotal, $ticketsRequested) {
            // Criar order
            $order = Order::create([
                'user_id' => $purchaseData['userId'],
                'total_amount' => $recalculatedTotal,
                'pix_payment_id' => $pixPaymentId,
                'status' => 'paid',
            ]);

            foreach ($ticketsRequested as $tr) {
                // A migration de order_tickets não possui quantity nem total_price,
                // apenas unit_price. Para representar a quantidade, criamos
                // vários registros OrderTicket quando quantity > 1.
                for ($i = 0; $i < $tr['quantity']; $i++) {
                    OrderTicket::create([
                        'order_id' => $order->id,
                        'ticket_id' => $tr['model']->id,
                        'unit_price' => $tr['model']->price,
                        'user_id' => $purchaseData['userId'],
                        'status' => 'paid',
                    ]);
                }
            }

            return $order->load('tickets');
        });
    }
}
