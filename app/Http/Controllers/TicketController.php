<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Ticket;
use App\Models\OrderTicket;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class TicketController extends Controller
{
    public function index()
    {
        $tickets = Ticket::all();
        return response()->json($tickets);
    }

    public function store(Request $request, Event $event)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'limit_quantity' => 'required|integer|min:1'
        ]);

        $event->tickets()->create($validated);

        return redirect()->back()->with('success', 'Ingresso criado com sucesso!');
    }

    public function destroy(Event $event, Ticket $ticket)
    {
        $ticket->delete();
        return redirect()->back()->with('success', 'Ingresso excluído com sucesso!');
    }

    public function show($id)
    {
        $ticket = Ticket::findOrFail($id);
        return response()->json($ticket);
    }

    /**
     * Página de validação de ingressos
     */
    public function validatePage($id)
    {
        $promoter = Auth::guard('promoter')->user();

        $event = Event::where('id', $id)
            ->where('company_id', $promoter->company_id)
            ->with('tickets')
            ->firstOrFail();

        return Inertia::render('Promoter/ValidateTickets', [
            'event' => $event
        ]);
    }

    /**
     * Valida um ingresso escaneado via QR Code
     */
    public function validateTicket(Request $request, $eventId)
    {

        $promoter = Auth::guard('promoter')->user();

        // Verifica se o evento pertence à empresa do promoter
        $event = Event::where('id', $eventId)
            ->where('company_id', $promoter->company_id)
            ->with('tickets')
            ->firstOrFail();

        $ticketData = $request->input('ticket_data');

        try {
            // Extrai dados do QR Code
            $orderTicketId = $ticketData['ticket_id'] ?? null;
            $orderId = $ticketData['order_id'] ?? null;
            $qrEventId = $ticketData['event_id'] ?? null;

            if (!$orderTicketId || !$orderId || !$qrEventId) {
                return response()->json([
                    'success' => false,
                    'message' => 'QR Code inválido - dados incompletos',
                    'type' => 'invalid_format'
                ]);
            }

            // Busca o order_ticket
            $orderTicket = OrderTicket::with(['order', 'ticket.event', 'order.user'])
                ->find($orderTicketId);

            if (!$orderTicket) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ingresso não encontrado no sistema',
                    'type' => 'not_found'
                ]);
            }

            // Verifica se o ingresso pertence ao evento correto
            if ($orderTicket->ticket->event_id != $eventId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Este ingresso não é válido para este evento',
                    'type' => 'wrong_event',
                    'ticket' => [
                        'id' => $orderTicket->id,
                        'type' => $orderTicket->ticket->name,
                        'event' => $orderTicket->ticket->event->name,
                    ]
                ]);
            }

            // Verifica se o pedido está pago
            if ($orderTicket->order->status !== 'paid') {
                return response()->json([
                    'success' => false,
                    'message' => 'Ingresso não pago - Status: ' . $orderTicket->order->status,
                    'type' => 'not_paid',
                    'ticket' => [
                        'id' => $orderTicket->id,
                        'type' => $orderTicket->ticket->name,
                        'price' => $orderTicket->unit_price,
                        'status' => $orderTicket->order->status,
                    ]
                ]);
            }

            // Verifica se já foi validado
            if ($orderTicket->status === 'validated') {
                return response()->json([
                    'success' => false,
                    'message' => 'Este ingresso já foi validado anteriormente',
                    'type' => 'already_validated',
                    'ticket' => [
                        'id' => $orderTicket->id,
                        'type' => $orderTicket->ticket->name,
                        'price' => $orderTicket->unit_price,
                        'user' => $orderTicket->order->user->name ?? 'Usuário',
                        'validated_at' => $orderTicket->updated_at->format('d/m/Y H:i:s'),
                    ]
                ]);
            }

            // VALIDAÇÃO APROVADA - Marca como validado
            $orderTicket->update([
                'status' => 'validated'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Ingresso validado com sucesso! Entrada liberada.',
                'type' => 'success',
                'ticket' => [
                    'id' => $orderTicket->id,
                    'type' => $orderTicket->ticket->name,
                    'price' => $orderTicket->unit_price,
                    'user' => $orderTicket->order->user->name ?? 'Usuário',
                    'validated_at' => now()->format('d/m/Y H:i:s'),
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Erro na validação de ingresso: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erro ao processar validação: ' . $e->getMessage(),
                'type' => 'error'
            ]);
        }
    }
}
