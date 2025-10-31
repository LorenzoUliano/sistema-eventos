<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentForms extends Model
{
    protected $table = 'payment_forms';
    protected $primaryKey = 'id';
    protected $fillable = [
        'name',
        'description',
        'active',
    ];

    public function eventPaymentForms()
    {
        return $this->hasMany(EventPaymentForms::class, 'payment_form_id');
    }
}
