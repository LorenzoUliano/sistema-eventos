<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Promoter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PromoterRegisteredController extends Controller
{
    public function create()
    {
        return Inertia::render('Promoter/Register');
    }

    public function store(Request $request)
    {
        // Obtém o Promoter autenticado
        $authPromoter = Auth::guard('promoter')->user();

        // Validação dos dados do Promoter
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:promoters|max:255',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // O novo Promoter deve pertencer à mesma empresa do Promoter autenticado
        $promoter = Promoter::create([
            'company_id' => $authPromoter->company_id, // Garante que o novo promoter pertence à mesma empresa
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
        ]);

        return redirect()->route('promoter.dashboard')->with('success', 'Promoter criado com sucesso!');
    }
}
