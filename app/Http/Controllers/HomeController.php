<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $events = Event::where('status', 'active')->orderBy('start_date', 'asc')->get();
        
        return Inertia::render('Home/Home', [
            'events' => $events,
        ]);
    }
}
