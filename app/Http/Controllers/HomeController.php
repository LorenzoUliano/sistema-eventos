<?php

namespace App\Http\Controllers;

use App\Services\HomeService;
use Inertia\Inertia;

class HomeController extends Controller
{
    protected HomeService $homeService;

    public function __construct(HomeService $homeService)
    {
        $this->homeService = $homeService;
    }

    public function index()
    {
        $companies = $this->homeService->getCompaniesWithEvents();

        return Inertia::render('Home/Home', [
            'companies' => $companies,
        ]);
    }

    public function showCompanyEvents($companyId)
    {
        $company = $this->homeService->getCompanyWithEvents($companyId);

        return Inertia::render('Company/Events', [
            'company' => $company,
        ]);
    }
}
