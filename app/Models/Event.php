<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'name',
        'description',
        'image_url',
        'start_date',
        'end_date',
        'location',
        'city',
        'state',
        'status',
    ];

    // Relacionamento com Company (um evento pertence a uma empresa)
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    // Relacionamento com Tickets (um evento tem vários ingressos)
    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function paymentForms()
    {
        return $this->belongsToMany(
            PaymentForms::class,
            'event_payment_forms',
            'event_id',
            'payment_form_id'
        )->where('payment_forms.active', 1);
    }
}
