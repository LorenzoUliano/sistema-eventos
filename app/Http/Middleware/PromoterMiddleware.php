<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PromoterMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::guard('promoter')->check()) {
            return redirect()->route('promoter.login');
        }
        return $next($request);
    }
}
