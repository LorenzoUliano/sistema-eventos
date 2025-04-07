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

        // Buscar eventos da empresa do promoter
        $events = Event::with('tickets')->where('company_id', $promoter->company_id)->get();

        return Inertia::render('Promoter/Dashboard', [
            'promoter' => $promoter,
            'events' => $events,
        ]);
    }
}
