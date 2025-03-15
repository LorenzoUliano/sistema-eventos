<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status',
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
                    ->withPivot('quantity', 'total_price')
                    ->withTimestamps();
    }
}
