<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

    public function manage($id)
    {
        $promoter = Auth::guard('promoter')->user();
        $event = Event::where('company_id', $promoter->company_id)->where('id', $id)->with('company', 'tickets')->firstOrFail();

        return Inertia::render('Promoter/EventManage', [
            'event' => $event,
        ]);
    }

    // Método para atualizar os dados do evento
    public function update(Request $request, $id)
    {
        $promoter = Auth::guard('promoter')->user();
        $event = Event::where('company_id', $promoter->company_id)->where('id', $id)->firstOrFail();

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'location' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:2',
            'status' => 'required|in:active,inactive,canceled',
        ]);

        $event->update($request->all());

        return redirect()->route('promoter.dashboard', $event->id)->with('success', 'Evento atualizado com sucesso!');
    }

    public function show($id)
    {
        $event = Event::with(['company', 'tickets'])->findOrFail($id);

        return Inertia::render('Event/Details', [
            'event' => $event,
        ]);
    }

    public function destroy($id)
    {
        Event::destroy($id);
        return redirect()->route('event.index')->with('success', 'Evento excluído com sucesso!');
    }
}
