<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'name',
        'price',
        'limit_quantity',
    ];

    protected $appends = ['type', 'quantity', 'sold', 'description', 'validated'];

    // Relacionamento: um ingresso pertence a um evento
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    // Relacionamento: um ingresso pode estar em vários pedidos
    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_tickets')
                    ->withPivot('quantity', 'unit_price')
                    ->withTimestamps();
    }

    // Relacionamento com order_tickets para contar vendas
    public function orderTickets()
    {
        return $this->hasMany(OrderTicket::class);
    }

    // Accessor: type é um alias para name
    protected function type(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->name,
        );
    }

    // Accessor: quantity é um alias para limit_quantity
    protected function quantity(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->limit_quantity,
        );
    }

    // Accessor: sold calcula quantos tickets foram vendidos
    protected function sold(): Attribute
    {
        return Attribute::make(
            get: function () {
                // Conta quantos ingressos foram vendidos (cada order_ticket = 1 ingresso)
                // Considera apenas pedidos pagos
                return $this->orderTickets()
                    ->whereHas('order', function ($query) {
                        $query->where('status', 'paid');
                    })
                    ->count() ?? 0;
            }
        );
    }

    // Accessor: description (por enquanto vazio, pode ser adicionado depois)
    protected function description(): Attribute
    {
        return Attribute::make(
            get: fn () => null,
        );
    }

    // Accessor: validated calcula quantos tickets foram validados (entrada confirmada)
    protected function validated(): Attribute
    {
        return Attribute::make(
            get: function () {
                // Conta quantos ingressos já foram validados (status = 'validated')
                return $this->orderTickets()
                    ->where('status', 'validated')
                    ->whereHas('order', function ($query) {
                        $query->where('status', 'paid');
                    })
                    ->count() ?? 0;
            }
        );
    }
}
