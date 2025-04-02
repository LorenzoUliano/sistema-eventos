<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $companies = Company::with(['events' => function ($query) {
            $query->where('status', 'active')
                ->orderBy('start_date', 'asc')
                ->take(3);
        }])->get();


        // Retorna as empresas com os eventos associados
        return Inertia::render('Home/Home', [
            'companies' => $companies,
        ]);
    }

    // Método para retornar até 20 eventos por empresa quando clicado no botão "Ver mais"
    public function showCompanyEvents($companyId)
    {
        $company = Company::with(['events' => function ($query) {
            $query->where('status', 'active')
                ->orderBy('start_date', 'asc')
                ->take(20); // Limita a 20 eventos por empresa
        }])->findOrFail($companyId);

        return Inertia::render('Company/Events', [
            'company' => $company,
        ]);
    }
}
