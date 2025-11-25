<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class PixPayment extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false; // UUID primary key
    protected $keyType = 'string';

    protected $fillable = [
        'id', // permitir set manual
        'user_id',
        'event_id',
        'amount',
        'status',
        'qr_code_raw',
        'qr_code_image',
        'purchase_payload',
        'expires_at',
    ];

    protected $casts = [
        'purchase_payload' => 'array',
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
