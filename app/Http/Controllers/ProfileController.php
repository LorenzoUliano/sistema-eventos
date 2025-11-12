<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function index(Request $request): Response
    {
        return $this->edit($request);
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Index', [
            'user' => $request->user(),
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Display the user's orders.
     */
    public function orders(Request $request): Response
    {
        $orders = \App\Models\Order::userOrders();
        
        // Calcular estatísticas
        $totalOrders = $orders->count();
        $totalSpent = $orders->flatMap(function ($order) {
            return $order->tickets->map(function ($ticket) {
                return $ticket->pivot->total_price ?? 0;
            });
        })->sum();
        
        $paidOrders = $orders->where('status', 'paid')->count();
        $pendingOrders = $orders->where('status', 'pending')->count();
        
        // Eventos mais visitados (baseado em tickets comprados)
        $eventCounts = [];
        foreach ($orders as $order) {
            foreach ($order->tickets as $ticket) {
                // Buscar o evento se não estiver carregado
                if (!$ticket->relationLoaded('event') && $ticket->event_id) {
                    $ticket->load('event.company');
                }
                
                if ($ticket->event) {
                    $eventId = $ticket->event->id;
                    if (!isset($eventCounts[$eventId])) {
                        $eventCounts[$eventId] = [
                            'event' => $ticket->event,
                            'count' => 0,
                            'total_spent' => 0
                        ];
                    }
                    $eventCounts[$eventId]['count'] += $ticket->pivot->quantity ?? 1;
                    $eventCounts[$eventId]['total_spent'] += $ticket->pivot->total_price ?? 0;
                }
            }
        }
        
        $mostVisitedEvents = collect($eventCounts)
            ->sortByDesc('count')
            ->take(5)
            ->values();
        
        return Inertia::render('Profile/Orders', [
            'user' => $request->user(),
            'orders' => $orders,
            'stats' => [
                'total_orders' => $totalOrders,
                'total_spent' => $totalSpent,
                'paid_orders' => $paidOrders,
                'pending_orders' => $pendingOrders,
            ],
            'most_visited_events' => $mostVisitedEvents,
        ]);
    }

    /**
     * Display the user's QR codes.
     */
    public function qrcodes(Request $request): Response
    {
        return Inertia::render('Profile/QRCodes', [
            'user' => $request->user(),
        ]);
    }

    /**
     * Display the support page.
     */
    public function support(Request $request): Response
    {
        return Inertia::render('Profile/Support', [
            'user' => $request->user(),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.index');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
