<?php

namespace App\Repositories;

use App\Models\Event;

class EventRepository
{
    public function all()
    {
        return Event::with('company')->get();
    }

    public function find($id)
    {
        return Event::with('company')->with('tickets')->findOrFail($id);
    }

    public function create(array $data)
    {
        return Event::create($data);
    }

    public function update(Event $event, array $data)
    {
        return $event->update($data);
    }

    public function cancel(Event $event)
    {
        return $event->update(['status' => 'canceled']);
    }

    public function findByCompany($id, $companyId)
    {
        return Event::where('id', $id)
            ->where('company_id', $companyId)
            ->firstOrFail();
    }

    public function findTickets($id)
    {
        return Event::where('id', $id)->with('tickets')->firstOrFail();
    }
}
