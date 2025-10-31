<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventPaymentForms extends Model
{
    protected $table = 'event_payment_forms';
    protected $primaryKey = 'id';
    protected $fillable = [
        'event_id',
        'payment_form_id',
    ];

    public function paymentForm()
    {
        return $this->belongsTo(PaymentForms::class, 'payment_form_id')
            ->where('payment_forms.active', 1);
    }
}
