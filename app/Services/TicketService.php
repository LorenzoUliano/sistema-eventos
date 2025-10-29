<?php

namespace App\Services;

use App\DTOs\TicketDTO;
use App\Models\Ticket;

class TicketService
{

    public function makeTickets($cart)
    {
        $tickets = [];

        foreach ($cart as $item) {
            $ticket = Ticket::find($item['id']);

            if (!$ticket) {
                return false;
            }

            if ($item['quantity'] > $ticket->limit_quantity) {
               return false;
            }
            $data = new TicketDTO($ticket, $item['quantity']);
            $tickets[] = $data->toArray();
        }

        return $tickets;
    }

}
