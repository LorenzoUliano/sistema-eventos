<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::userOrders();

        // Calcular estatísticas
        $totalOrders = $orders->count();
        $totalSpent = $orders->flatMap(function ($order) {
            return $order->tickets->map(function ($ticket) {
                return $ticket->pivot->total_price ?? 0;
            });
        })->sum();

        $paidOrders = $orders->where('status', 'paid')->count();
        $pendingOrders = $orders->where('status', 'pending')->count();

        // Eventos mais visitados (baseado em tickets comprados)
        $eventCounts = [];
        foreach ($orders as $order) {
            foreach ($order->tickets as $ticket) {
                // Buscar o evento se não estiver carregado
                if (!$ticket->relationLoaded('event') && $ticket->event_id) {
                    $ticket->load('event.company');
                }

                if ($ticket->event) {
                    $eventId = $ticket->event->id;
                    if (!isset($eventCounts[$eventId])) {
                        $eventCounts[$eventId] = [
                            'event' => $ticket->event,
                            'count' => 0,
                            'total_spent' => 0
                        ];
                    }
                    $eventCounts[$eventId]['count'] += $ticket->pivot->quantity ?? 1;
                    $eventCounts[$eventId]['total_spent'] += $ticket->pivot->total_price ?? 0;
                }
            }
        }

        $mostVisitedEvents = collect($eventCounts)
            ->sortByDesc('count')
            ->take(5)
            ->values();

        return Inertia::render('Order/Order', [
            'orders' => $orders,
            'stats' => [
                'total_orders' => $totalOrders,
                'total_spent' => $totalSpent,
                'paid_orders' => $paidOrders,
                'pending_orders' => $pendingOrders,
            ],
            'most_visited_events' => $mostVisitedEvents,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'status' => 'required|in:pending,paid,canceled',
        ]);

        $order = Order::create($request->all());
        return response()->json($order, 201);
    }

    public function show($id)
    {
        $order = Order::where('user_id', Auth::id())
            ->with(['tickets.event.company'])
            ->findOrFail($id);

        return Inertia::render('Order/OrderDetails', [
            'order' => $order,
        ]);
    }

    public function destroy($id)
    {
        $order = Order::where('user_id', Auth::id())
            ->where('status', 'pending')
            ->findOrFail($id);

        $order->update(['status' => 'canceled']);

        return redirect()->route('order.index')->with('success', 'Pedido cancelado com sucesso!');
    }
}
