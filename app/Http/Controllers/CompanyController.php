<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function index()
    {
        $companies = Company::all();
        return Inertia::render('Companies/Companies', ['companies' => $companies]);
    }

    public function create()
    {
        return Inertia::render('CompanyCreate/CompanyCreate');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'cnpj' => 'required|string|unique:companies|max:18',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|string|email|max:255',
        ]);

        Company::create($request->all());

        return redirect()->route('company.index')->with('success', 'Empresa criada com sucesso!');
    }

    public function show($id)
    {
        $company = Company::with('events')->findOrFail($id);

        return Inertia::render('Company/Company', [
            'company' => $company,
        ]);
    }

    public function destroy($id)
    {
        Company::destroy($id);
        return redirect()->route('company.index')->with('success', 'Empresa excluída com sucesso!');
    }
}
