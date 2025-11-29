<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PromoterDashboardController extends Controller
{
    public function index()
    {
        $promoter = Auth::guard('promoter')->user();

        // Buscar eventos da empresa do promoter com tickets e vendas
        $events = Event::with([
            'tickets.orderTickets' => function ($query) {
                // Carregar apenas order_tickets de pedidos pagos para calcular vendas
                $query->whereHas('order', function ($q) {
                    $q->where('status', 'paid');
                });
            },
            'tickets.orderTickets.order'
        ])->where('company_id', $promoter->company_id)->get();

        return Inertia::render('Promoter/Dashboard', [
            'promoter' => $promoter,
            'events' => $events,
        ]);
    }
}
