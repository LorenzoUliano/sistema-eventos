<?php

namespace App\Http\Controllers;

use App\Models\Promoter;
use Illuminate\Http\Request;

class PromoterController extends Controller
{
    public function index()
    {
        $promoters = Promoter::all();
        return response()->json($promoters);
    }

    public function store(Request $request)
    {
        $request->validate([
            'company_id' => 'required|exists:companies,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:promoters|max:255',
            'phone' => 'nullable|string|max:20',
            'password_hash' => 'required|string|max:255',
        ]);

        $promoter = Promoter::create($request->all());
        return response()->json($promoter, 201);
    }

    public function show($id)
    {
        $promoter = Promoter::findOrFail($id);
        return response()->json($promoter);
    }

    public function destroy($id)
    {
        Promoter::destroy($id);
        return response()->json(['message' => 'Promoter deleted']);
    }
}
