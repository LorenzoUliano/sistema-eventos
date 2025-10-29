<?php

namespace App\DTOs;

class TicketDTO
{
    public int $id;
    public string $name;
    public float $price;
    public int $limit_quantity;
    public int $selected_quantity;

    public function __construct($ticket, int $selectedQuantity)
    {
        $this->id = $ticket->id;
        $this->name = $ticket->name;
        $this->price = (float) $ticket->price;
        $this->limit_quantity = $ticket->limit_quantity;
        $this->selected_quantity = $selectedQuantity;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => $this->price * $this->selected_quantity,
            'quantity' => $this->selected_quantity,
        ];
    }
}
