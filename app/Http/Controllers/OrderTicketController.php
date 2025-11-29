<?php

namespace App\Http\Controllers;

use App\Models\OrderTicket;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;

class OrderTicketController extends Controller
{
    /**
     * Verifica se o usuário autenticado pode visualizar/validar este ingresso.
     */
    protected function authorizeView(OrderTicket $orderTicket): void
    {
        if ($orderTicket->user_id !== Auth::id()) {
            abort(403, 'Não autorizado a visualizar este ingresso.');
        }
    }

    /**
     * Página com os dados do ingresso e QR Code de validação.
     */
    public function show(string $id)
    {
        $orderTicket = OrderTicket::with([
            'order',
            'ticket.event.company'
        ])->findOrFail($id);

        $this->authorizeView($orderTicket);

        return Inertia::render('Order/OrderTicketDetails', [
            'orderTicket' => $orderTicket,
            'order' => $orderTicket->order,
        ]);
    }

    /**
     * Validação via leitura do QR (GET). Idempotente.
     */
    public function scan(string $id)
    {
        $orderTicket = OrderTicket::findOrFail($id);
        $this->authorizeView($orderTicket);

        if ($orderTicket->status === 'validated') {
            return response()->json([
                'status' => 'already_validated',
                'order_ticket_id' => $orderTicket->id,
            ]);
        }

        if ($orderTicket->status !== 'paid') {
            return response()->json([
                'status' => 'invalid_state',
                'current' => $orderTicket->status,
            ], 422);
        }

        $orderTicket->status = 'validated';
        $orderTicket->save();

        return response()->json([
            'status' => 'validated',
            'order_ticket_id' => $orderTicket->id,
        ]);
    }

    /**
     * Validação manual (POST) reutiliza a lógica do scan.
     */
    public function validateManual(string $id)
    {
        return $this->scan($id);
    }
}
