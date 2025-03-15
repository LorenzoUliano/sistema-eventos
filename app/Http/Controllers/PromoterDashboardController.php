<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PromoterDashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Promoter/Dashboard');
    }
}
