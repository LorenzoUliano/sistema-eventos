<?php

namespace App\Services;

use Illuminate\Support\Str;

class MockPixService
{
    private $payments = [];

    public function generateQrCode($amount, $purchaseData)
    {
        $paymentId = (string) Str::uuid();
        $qrCode = "00020126580014br.gov.bcb.pix" . $paymentId . $amount;

        $payment = [
            'id' => $paymentId,
            'qrCode' => $qrCode,
            'amount' => $amount,
            'purchaseData' => $purchaseData,
            'status' => 'pending',
            'createdAt' => now(),
        ];

        $this->payments[$paymentId] = $payment;
        return $payment;
    }

    public function validateQrCode($qrCode)
    {
        foreach ($this->payments as $payment) {
            if ($payment['qrCode'] === $qrCode) {
                return $payment;
            }
        }
        return null;
    }

    public function approvePayment($paymentId)
    {
        if (isset($this->payments[$paymentId])) {
            $this->payments[$paymentId]['status'] = 'approved';
            return true;
        }
        return false;
    }

    public function getPaymentData($paymentId)
    {
        return $this->payments[$paymentId] ?? null;
    }
}
