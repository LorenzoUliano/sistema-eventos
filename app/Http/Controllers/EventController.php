<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
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
        return Inertia::render('Promoter/EventCreate');
    }

    public function store(Request $request)
    {
        $promoter = Auth::guard('promoter')->user();
    
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|file|mimes:jpeg,png|max:2048',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'location' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:2',
            'status' => 'required|in:active,inactive,canceled',
        ]);
    
        $imageUrl = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->getRealPath();
            $response = Http::withHeaders([
                'Authorization' => 'Client-ID fe70325f48359d4',
            ])->attach('image', file_get_contents($imagePath), $request->file('image')->getClientOriginalName())
            ->post('https://api.imgur.com/3/upload');
    
            if ($response->successful()) {
                $imageUrl = $response->json()['data']['link'];
            }
        }
    
        Event::create([
            'company_id' => $promoter->company_id,
            'name' => $request->name,
            'description' => $request->description,
            'image_url' => $imageUrl,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'location' => $request->location,
            'city' => $request->city,
            'state' => $request->state,
            'status' => $request->status,
        ]);
    
        return redirect()->route('promoter.dashboard')->with('success', 'Evento criado com sucesso!');
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
