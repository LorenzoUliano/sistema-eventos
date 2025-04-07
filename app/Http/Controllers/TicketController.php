<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index()
    {
        $tickets = Ticket::all();
        return response()->json($tickets);
    }

    public function store(Request $request, Event $event)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'limit_quantity' => 'required|integer|min:1'
        ]);

        $event->tickets()->create($validated);

        return redirect()->back()->with('success', 'Ingresso criado com sucesso!');
    }

    public function destroy(Event $event, Ticket $ticket)
    {
        $ticket->delete();
        return redirect()->back()->with('success', 'Ingresso excluído com sucesso!');
    }

    public function show($id)
    {
        $ticket = Ticket::findOrFail($id);
        return response()->json($ticket);
    }

}
