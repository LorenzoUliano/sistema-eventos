<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status',
        'total_amount',
        'pix_payment_id',
    ];

    // Relacionamento: um pedido pertence a um usuário
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relacionamento: um pedido pode ter vários ingressos diferentes
    public function tickets()
    {
        return $this->belongsToMany(Ticket::class, 'order_tickets')
                    ->withPivot('id', 'unit_price', 'status')
                    ->withTimestamps();
    }

    public function orderTickets()
    {
        return $this->hasMany(OrderTicket::class);
    }

    public static function userOrders()
    {
        return self::where('user_id', Auth::user()->id)
            ->with(['tickets.event.company', 'orderTickets'])
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
