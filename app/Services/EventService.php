<?php

namespace App\Services;

use App\Models\Event;
use App\Repositories\EventRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class EventService
{
    protected EventRepository $eventRepository;

    public function __construct(EventRepository $eventRepository)
    {
        $this->eventRepository = $eventRepository;
    }

    public function getAll()
    {
        return $this->eventRepository->all();
    }

    public function findById(int $id)
    {
        return $this->eventRepository->find($id);
    }

    public function store(Request $request): Event
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

        $imageUrl = $this->uploadImage($request);

        return $this->eventRepository->create([
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
    }

    public function update(Request $request, $id)
    {
        $promoter = Auth::guard('promoter')->user();
        $event = $this->eventRepository->find($id);

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

        $imageUrl = $this->uploadImage($request);

        $this->eventRepository->update($event, array_merge($request->except(['image']), ['image_url' => $imageUrl]));

        return $event;
    }

    public function cancelEvent($id)
    {
        $event = $this->eventRepository->find($id);
        return $this->eventRepository->cancel($event);
    }

    private function uploadImage(Request $request)
    {
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->getRealPath();
            $response = Http::withHeaders([
                'Authorization' => 'Client-ID fe70325f48359d4',
            ])->attach('image', file_get_contents($imagePath), $request->file('image')->getClientOriginalName())
            ->post('https://api.imgur.com/3/upload');

            if ($response->successful()) {
                return $response->json()['data']['link'];
            }
        }
        return null;
    }

    public function getEventForPromoter($id)
    {
        $promoter = Auth::guard('promoter')->user();

        return $this->eventRepository->findByCompany($id, $promoter->company_id);
    }


    public function getTickets($id) {
        return $this->eventRepository->findTickets($id);
    }
}
