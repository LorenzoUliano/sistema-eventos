<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PromoterAuthenticatedSessionController extends Controller
{
    public function create()
    {
        return Inertia::render('Promoter/Login');
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::guard('promoter')->attempt($credentials)) {
            return redirect()->route('promoter.dashboard');
        }

        return back()->withErrors(['email' => 'Credenciais inválidas']);
    }

    public function destroy()
    {
        Auth::guard('promoter')->logout();
        return redirect()->route('promoter.login');
    }
}
