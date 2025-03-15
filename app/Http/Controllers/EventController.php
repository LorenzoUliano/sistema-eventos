<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::all();
        return Inertia::render('Event/Event', ['events' => $events]);
    }

    public function create()
    {
        return Inertia::render('EventCreate/EventCreate');
    }

    public function store(Request $request)
    {
        $request->validate([
            'company_id' => 'required|exists:companies,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'location' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:50',
            'status' => 'required|in:active,canceled,finished',
        ]);

        Event::create($request->all());

        return redirect()->route('event.index')->with('success', 'Evento criado com sucesso!');
    }

    public function show($id)
    {
        $event = Event::findOrFail($id);
        return Inertia::render('EventShow/EventShow', ['event' => $event]);
    }

    public function destroy($id)
    {
        Event::destroy($id);
        return redirect()->route('event.index')->with('success', 'Evento excluído com sucesso!');
    }
}
