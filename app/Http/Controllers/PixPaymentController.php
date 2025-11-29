<?php

namespace App\Http\Controllers;

use App\Services\PixPaymentService;
use App\Services\OrderService;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class PixPaymentController extends Controller
{
    public function __construct(private PixPaymentService $pixService, private OrderService $orderService) {}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'purchaseData' => 'required|array',
            'purchaseData.userId' => 'required|integer|exists:users,id',
            'purchaseData.eventId' => 'required|integer|exists:events,id',
            'purchaseData.tickets' => 'required|array|min:1',
            'purchaseData.tickets.*.ticketTypeId' => 'required|integer|exists:tickets,id',
            'purchaseData.tickets.*.quantity' => 'required|integer|min:1',
        ]);

        $payment = $this->pixService->initiate(
            $validated['purchaseData']['userId'],
            $validated['purchaseData']['eventId'],
            $validated['purchaseData'],
            (float) $validated['amount']
        );

        return response()->json([
            'id' => $payment->id,
            'status' => $payment->status,
            'qrCode' => $payment->qr_code_raw,
            'expiresAt' => $payment->expires_at,
            'amount' => $payment->amount,
        ], 201);
    }

    public function show(string $id)
    {
        $payment = $this->pixService->get($id);
        if (!$payment) {
            return response()->json(['error' => 'Pagamento não encontrado'], 404);
        }

        return response()->json([
            'id' => $payment->id,
            'status' => $payment->status,
            'amount' => $payment->amount,
            'expiresAt' => $payment->expires_at,
        ]);
    }

    public function confirm(string $id)
    {
        try {
            $payment = $this->pixService->confirm($id);

            // Verificar se order já existe (idempotente)
            $existingOrder = Order::where('pix_payment_id', $payment->id)->first();
            if ($existingOrder) {
                // Limpa o carrinho mesmo em chamadas repetidas
                Session::forget('cart');
                return response()->json([
                    'status' => 'already_paid',
                    'order' => $existingOrder->load('tickets'),
                    'redirect' => route('profile.orders'),
                ]);
            }

            $payload = $payment->purchase_payload;
            $syntheticPixData = [
                'id' => $payment->id,
                'amount' => $payment->amount,
                'purchaseData' => $payload,
            ];
            $order = $this->orderService->createOrderFromPix($syntheticPixData);

            // Limpa carrinho da sessão
            Session::forget('cart');

            return response()->json([
                'status' => 'paid',
                'order' => $order,
                'redirect' => route('profile.orders'),
            ]);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
}
