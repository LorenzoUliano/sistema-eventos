<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Promoter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PromoterAuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Promoter/Login');
    }

    public function login(Request $request)
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

    public function logout()
    {
        Auth::guard('promoter')->logout();
        return redirect()->route('promoter.login');
    }
}
