<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderTicket extends Model
{
    use HasFactory;

    protected $table = 'order_tickets';

    protected $fillable = [
        'order_id',
        'ticket_id',
        'quantity',
        'total_price',
        'user_id',
        'status',
    ];
}
