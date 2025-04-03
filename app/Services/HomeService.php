<?php

namespace App\Services;

use App\Models\Company;

class HomeService
{
    public function getCompaniesWithEvents()
    {
        return Company::with(['events' => function ($query) {
            $query->where('status', 'active')
                ->orderBy('start_date', 'asc')
                ->take(3);
        }])->get();
    }

    public function getCompanyWithEvents($companyId)
    {
        return Company::with(['events' => function ($query) {
            $query->where('status', 'active')
                ->orderBy('start_date', 'asc')
                ->take(20);
        }])->findOrFail($companyId);
    }
}
