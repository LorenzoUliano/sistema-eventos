<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'name',
        'price',
        'limit_quantity',
    ];

    // Relacionamento: um ingresso pertence a um evento
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    // Relacionamento: um ingresso pode estar em vários pedidos
    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_tickets')
                    ->withPivot('quantity', 'total_price')
                    ->withTimestamps();
    }
}
