<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class OrderTicket extends Pivot
{
    use HasFactory;

    protected $table = 'order_tickets';

    protected $fillable = [
        'order_id',
        'ticket_id',
        'quantity',
        'total_price',
    ];
}
