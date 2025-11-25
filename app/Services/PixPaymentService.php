<?php

namespace App\Services;

use App\Models\PixPayment;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PixPaymentService
{
    public function initiate(int $userId, int $eventId, array $purchaseData, float $amount): PixPayment
    {
        $id = (string) Str::uuid();
        // Garante que o valor de expiracao seja numerico para evitar erro do Carbon
        $expirationMinutes = (int) config('pix.expiration', 15);
        $expires = now()->addMinutes($expirationMinutes);

        // Cria um QR "falso" que aponta para uma URL de confirmacao
        $baseUrl = rtrim(config('app.url'), '/');
        $qrRaw = $baseUrl . '/api/pix/payments/' . $id . '/scan';

        $payment = new PixPayment();
        $payment->id = $id;
        $payment->user_id = $userId;
        $payment->event_id = $eventId;
        $payment->amount = $amount;
        $payment->qr_code_raw = $qrRaw;
        $payment->purchase_payload = $purchaseData;
        $payment->expires_at = $expires;
        $payment->status = 'pending';
        $payment->save();

        return $payment;
    }

    public function get(string $id): ?PixPayment
    {
        return PixPayment::find($id);
    }

    public function confirm(string $id): PixPayment
    {
        return DB::transaction(function () use ($id) {
            $payment = PixPayment::lockForUpdate()->findOrFail($id);
            if ($payment->status === 'expired') {
                throw new \RuntimeException('Pagamento expirado.');
            }
            if ($payment->status === 'paid') {
                return $payment; // idempotente
            }
            if ($payment->expires_at && $payment->expires_at->isPast()) {
                $payment->status = 'expired';
                $payment->save();
                throw new \RuntimeException('Pagamento expirado.');
            }
            $payment->status = 'paid';
            $payment->save();
            return $payment;
        });
    }

    public function expire(string $id): ?PixPayment
    {
        $payment = PixPayment::find($id);
        if ($payment && $payment->status === 'pending') {
            $payment->status = 'expired';
            $payment->save();
        }
        return $payment;
    }
}
