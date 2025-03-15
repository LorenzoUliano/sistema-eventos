<?php

namespace App\Http\Controllers;

use App\Models\OrderTicket;
use Illuminate\Http\Request;

class OrderTicketController extends Controller
{
    public function index()
    {
        $orderTickets = OrderTicket::all();
        return response()->json($orderTickets);
    }

    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'ticket_id' => 'required|exists:tickets,id',
            'quantity' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:0',
        ]);

        $orderTicket = OrderTicket::create($request->all());
        return response()->json($orderTicket, 201);
    }

    public function show($id)
    {
        $orderTicket = OrderTicket::findOrFail($id);
        return response()->json($orderTicket);
    }

    public function destroy($id)
    {
        OrderTicket::destroy($id);
        return response()->json(['message' => 'Order ticket deleted']);
    }
}
