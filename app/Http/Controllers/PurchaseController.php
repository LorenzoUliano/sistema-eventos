<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePurchaseRequest;
use App\Http\Requests\UpdatePurchaseRequest;
use App\Models\Event;
use App\Services\TicketService;
use Illuminate\Http\Client\Request;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    protected TicketService $ticketService;
    public function __construct()
    {
        $this->ticketService = new TicketService();
    }

    /**
     * Display a listing of the resource.
     */
    public function index($eventId)
    {
        $data = session()->all();

        $event = Event::find($eventId);

        $tickets = $this->ticketService->makeTickets($data['cart']);
        if (!$tickets) {
            return response([
                'message' => 'Não foi possível encontrar os ingressos'
            ], 400);
        }


        return Inertia::render('Purchase/Purchase', [
            'tickets' => $tickets,
            'event' => $event,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePurchaseRequest $request)
    {
        //
    }
}
