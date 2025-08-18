<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class CartController extends Controller
{
    public function addToCart(Request $request)
    {
        $cart = $request->get('cart');

        if(empty($cart)) {
            return response()->json([
                'error' => 'Empty Cart!'
            ], 400);
        }

        $eventId = $cart[0]['event_id'];

        $event = Event::find($eventId);

        if(!$event) {
            return response()->json([
                'error' => 'Not Found Event!'
            ], 400);
        }

        Session::put('cart', $cart);

        $redirect = "/{$event->id}/purchase";

        return response()->json([
            'redirect_url' => $redirect
        ], 200);
    }
}
