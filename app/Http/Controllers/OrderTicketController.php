<?php

namespace App\Http\Controllers;

use App\Models\OrderTicket;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;

class OrderTicketController extends Controller
{
    /**
     * Verifica se o usuário autenticado pode visualizar/validar este ingresso.
     */
    protected function authorizeView(OrderTicket $orderTicket): void
    {
        if ($orderTicket->user_id !== Auth::id()) {
            abort(403, 'Não autorizado a visualizar este ingresso.');
        }
    }

    /**
     * Página com os dados do ingresso e QR Code de validação.
     */
    public function show(string $id)
    {
        $orderTicket = OrderTicket::with(['order.tickets', 'ticket.event'])->findOrFail($id);
        $this->authorizeView($orderTicket);

        $scanUrl = rtrim(config('app.url'), '/') . '/order-tickets/' . $orderTicket->id . '/scan';

        return Inertia::render('OrderTicket/Show', [
            'orderTicket' => [
                'id' => $orderTicket->id,
                'status' => $orderTicket->status,
                'quantity' => $orderTicket->quantity,
                'total_price' => $orderTicket->total_price,
                'scan_url' => $scanUrl,
                'ticket' => $orderTicket->ticket ? [
                    'id' => $orderTicket->ticket->id,
                    'name' => $orderTicket->ticket->name,
                    'event' => $orderTicket->ticket->event ? [
                        'id' => $orderTicket->ticket->event->id,
                        'name' => $orderTicket->ticket->event->name,
                    ] : null,
                ] : null,
            ],
        ]);
    }

    /**
     * Validação via leitura do QR (GET). Idempotente.
     */
    public function scan(string $id)
    {
        $orderTicket = OrderTicket::findOrFail($id);
        $this->authorizeView($orderTicket);

        if ($orderTicket->status === 'validated') {
            return response()->json([
                'status' => 'already_validated',
                'order_ticket_id' => $orderTicket->id,
            ]);
        }

        if ($orderTicket->status !== 'paid') {
            return response()->json([
                'status' => 'invalid_state',
                'current' => $orderTicket->status,
            ], 422);
        }

        $orderTicket->status = 'validated';
        $orderTicket->save();

        return response()->json([
            'status' => 'validated',
            'order_ticket_id' => $orderTicket->id,
        ]);
    }

    /**
     * Validação manual (POST) reutiliza a lógica do scan.
     */
    public function validateManual(string $id)
    {
        return $this->scan($id);
    }
}
