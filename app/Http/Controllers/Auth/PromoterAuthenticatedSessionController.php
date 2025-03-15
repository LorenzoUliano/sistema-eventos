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
            $request->session()->regenerate();

            return redirect()->route('promoter.dashboard');
        }

        return back()->withErrors(['email' => 'Credenciais inválidas']);
    }

    public function destroy(Request $request)
    {
        Auth::guard('promoter')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('promoter.login');
    }
}
