<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::withCount(['orders']);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        // Role filter
        if ($request->has('role') && $request->role) {
            $query->where('role', $request->role);
        }

        // Date range filter
        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        
        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $users = $query->latest()->paginate(15)->withQueryString();

        $roleOptions = [
            'customer' => 'Customer',
            'admin' => 'Admin'
        ];

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roleOptions' => $roleOptions,
            'filters' => $request->only(['search', 'role', 'date_from', 'date_to'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:customer,admin',
        ]);

        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'email_verified_at' => now(), // Auto-verify admin created users
        ];

        // If creating admin, also set admin_verified_at
        if ($request->role === 'admin') {
            $userData['admin_verified_at'] = now();
        }

        User::create($userData);

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $user->load(['orders.orderItems.product']);
        
        return Inertia::render('Admin/Users/Show', [
            'user' => $user
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'required|in:customer,admin',
        ]);

        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ];

        // Update password if provided
        if ($request->filled('password')) {
            $userData['password'] = Hash::make($request->password);
        }

        // Handle admin role changes
        if ($request->role === 'admin' && $user->role !== 'admin') {
            // Promoting to admin
            $userData['admin_verified_at'] = now();
        } elseif ($request->role !== 'admin' && $user->role === 'admin') {
            // Demoting from admin
            $userData['admin_verified_at'] = null;
        }

        $user->update($userData);

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Prevent deleting current admin user
        if ($user->id === auth()->id()) {
            return redirect()->back()
                ->with('error', 'You cannot delete your own account.');
        }

        // Check if user has orders
        if ($user->orders()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Cannot delete user with existing orders. Consider deactivating instead.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Toggle user status (activate/deactivate).
     */
    public function toggleStatus(User $user)
    {
        // Prevent deactivating current admin user
        if ($user->id === auth()->id()) {
            return redirect()->back()
                ->with('error', 'You cannot deactivate your own account.');
        }

        $user->update([
            'email_verified_at' => $user->email_verified_at ? null : now()
        ]);

        $status = $user->email_verified_at ? 'activated' : 'deactivated';
        return redirect()->back()
            ->with('success', "User {$status} successfully.");
    }
}
