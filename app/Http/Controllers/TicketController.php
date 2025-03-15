<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index()
    {
        $tickets = Ticket::all();
        return response()->json($tickets);
    }

    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'limit_quantity' => 'required|integer|min:1',
        ]);

        $ticket = Ticket::create($request->all());
        return response()->json($ticket, 201);
    }

    public function show($id)
    {
        $ticket = Ticket::findOrFail($id);
        return response()->json($ticket);
    }

    public function destroy($id)
    {
        Ticket::destroy($id);
        return response()->json(['message' => 'Ticket deleted']);
    }
}
