<?php

namespace App\Http\Controllers;

use App\Services\EventService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    protected EventService $eventService;

    public function __construct(EventService $eventService)
    {
        $this->eventService = $eventService;
    }

    public function index()
    {
        $events = $this->eventService->getAll();
        return Inertia::render('Event/Event', ['events' => $events]);
    }

    public function create()
    {
        return Inertia::render('Promoter/EventForm');
    }

    public function store(Request $request): RedirectResponse
    {
        $this->eventService->store($request);
        return to_route('promoter.dashboard')->with('success', 'Evento criado com sucesso!');
    }

    public function manage($id)
    {
        $event = $this->eventService->getEventForPromoter($id);
        return Inertia::render('Promoter/EventForm', ['event' => $event]);
    }

    public function update(Request $request, $id)
    {
        $this->eventService->update($request, $id);
        return redirect()->route('promoter.dashboard')->with('success', 'Evento atualizado com sucesso!');
    }

    public function show($id)
    {
        $event = $this->eventService->findById($id);
        return Inertia::render('Event/Details', ['event' => $event]);
    }

    public function destroy($id)
    {
        $this->eventService->cancelEvent($id);
        return redirect()->route('event.index')->with('success', 'Evento excluído com sucesso!');
    }

    public function tickets($id) {
        $event = $this->eventService->getTickets($id);

        return Inertia::render('Promoter/EventTickets', ['event' => $event]);
    }
}
