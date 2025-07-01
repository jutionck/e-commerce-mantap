<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            return redirect()->route('login')->with('error', 'Silakan login terlebih dahulu.');
        }

        // Check if user is admin
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Unauthorized. Admin access required.');
        }

        // Check if admin is verified (optional additional security)
        // Skip verification check in testing environment
        if (!app()->environment('testing') && !auth()->user()->isVerifiedAdmin()) {
            abort(403, 'Admin account not verified. Contact system administrator.');
        }

        return $next($request);
    }
}
