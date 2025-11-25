<?php

namespace App\Http\Controllers;

use App\Services\MockPixService;
use App\Services\OrderService;
use Illuminate\Http\Request;

class PixController extends Controller
{
    private $pixService;
    private $orderService;

    public function __construct(MockPixService $pixService, OrderService $orderService)
    {
        $this->pixService = $pixService;
        $this->orderService = $orderService;
    }

    public function generateQrCode(Request $request)
    {
        try {
            $validated = $request->validate([
                'amount' => 'required|numeric|min:0.01',
                'purchaseData' => 'required|array',
                'purchaseData.userId' => 'required|integer',
                'purchaseData.eventId' => 'required|integer',
                'purchaseData.tickets' => 'required|array',
            ]);

            $payment = $this->pixService->generateQrCode($validated['amount'], $validated['purchaseData']);

            return response()->json([
                'success' => true,
                'paymentId' => $payment['id'],
                'qrCode' => $payment['qrCode'],
                'amount' => $payment['amount'],
                'status' => $payment['status'],
            ]);
        } catch (\Exception $error) {
            return response()->json(['error' => $error->getMessage()], 500);
        }
    }

    public function processQrCode(Request $request)
    {
        try {
            $validated = $request->validate([
                'qrCode' => 'required|string',
            ]);

            $payment = $this->pixService->validateQrCode($validated['qrCode']);

            if (!$payment) {
                return response()->json(['error' => 'QR code inválido'], 404);
            }

            if ($payment['status'] === 'pending') {
                $this->pixService->approvePayment($payment['id']);
            }

            $paymentData = $this->pixService->getPaymentData($payment['id']);

            // Apenas cria order se ainda não criada (idempotência simples)
            $order = $this->orderService->createOrderFromPix($paymentData);

            return response()->json([
                'success' => true,
                'message' => 'Pagamento confirmado e order criada',
                'order' => $order,
            ]);
        } catch (\Exception $error) {
            return response()->json(['error' => $error->getMessage()], 500);
        }
    }
}
