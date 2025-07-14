<?php

namespace App\Http\Controllers;

use App\Models\UserAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AddressController extends Controller
{
    /**
     * Display a listing of the user's addresses.
     */
    public function index()
    {
        $addresses = Auth::user()->addresses()->orderBy('is_default', 'desc')->get();

        return Inertia::render('Addresses/Index', [
            'addresses' => $addresses,
        ]);
    }

    /**
     * Show the form for creating a new address.
     */
    public function create()
    {
        return Inertia::render('Addresses/Create');
    }

    /**
     * Store a newly created address in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'label' => 'nullable|string|max:255',
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'address' => 'required|string',
            'city' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'is_default' => 'boolean',
        ]);

        $address = Auth::user()->addresses()->create($request->all());

        // If this is set as default, update other addresses
        if ($request->is_default) {
            $address->setAsDefault();
        }

        return redirect()->route('addresses.index')
            ->with('success', 'Address saved successfully.');
    }

    /**
     * Display the specified address.
     */
    public function show(UserAddress $address)
    {
        $this->authorize('view', $address);

        return Inertia::render('Addresses/Show', [
            'address' => $address,
        ]);
    }

    /**
     * Show the form for editing the specified address.
     */
    public function edit(UserAddress $address)
    {
        $this->authorize('update', $address);

        return Inertia::render('Addresses/Edit', [
            'address' => $address,
        ]);
    }

    /**
     * Update the specified address in storage.
     */
    public function update(Request $request, UserAddress $address)
    {
        $this->authorize('update', $address);

        $request->validate([
            'label' => 'nullable|string|max:255',
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'address' => 'required|string',
            'city' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'is_default' => 'boolean',
        ]);

        $address->update($request->all());

        // If this is set as default, update other addresses
        if ($request->is_default) {
            $address->setAsDefault();
        }

        return redirect()->route('addresses.index')
            ->with('success', 'Address updated successfully.');
    }

    /**
     * Remove the specified address from storage.
     */
    public function destroy(UserAddress $address)
    {
        $this->authorize('delete', $address);

        $address->delete();

        return redirect()->route('addresses.index')
            ->with('success', 'Address deleted successfully.');
    }

    /**
     * Set an address as default.
     */
    public function setDefault(UserAddress $address)
    {
        $this->authorize('update', $address);

        $address->setAsDefault();

        return redirect()->route('addresses.index')
            ->with('success', 'Default address updated successfully.');
    }

    /**
     * API endpoint to get user's addresses (for checkout).
     */
    public function getAddresses()
    {
        $addresses = Auth::user()->addresses()->orderBy('is_default', 'desc')->get();

        return response()->json([
            'addresses' => $addresses,
        ]);
    }
}