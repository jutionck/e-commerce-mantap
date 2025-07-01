<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Order::with(['user', 'orderItems.product']);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('order_number', 'like', '%' . $search . '%')
                  ->orWhereHas('user', function($userQuery) use ($search) {
                      $userQuery->where('name', 'like', '%' . $search . '%')
                               ->orWhere('email', 'like', '%' . $search . '%');
                  });
            });
        }

        // Status filter
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Date range filter
        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        
        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $orders = $query->latest()->paginate(15)->withQueryString();

        $statusOptions = [
            'pending' => 'Pending',
            'confirmed' => 'Confirmed', 
            'processing' => 'Processing',
            'shipped' => 'Shipped',
            'delivered' => 'Delivered',
            'cancelled' => 'Cancelled'
        ];

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'statusOptions' => $statusOptions,
            'filters' => $request->only(['search', 'status', 'date_from', 'date_to'])
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        $order->load(['user', 'orderItems.product.category']);
        
        return Inertia::render('Admin/Orders/Show', [
            'order' => $order
        ]);
    }

    /**
     * Update order status.
     */
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled'
        ]);

        $order->update([
            'status' => $request->status
        ]);

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }

    /**
     * Export orders to CSV.
     */
    public function export(Request $request)
    {
        $query = Order::with(['user', 'orderItems.product']);

        // Apply same filters as index
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('order_number', 'like', '%' . $search . '%')
                  ->orWhereHas('user', function($userQuery) use ($search) {
                      $userQuery->where('name', 'like', '%' . $search . '%')
                               ->orWhere('email', 'like', '%' . $search . '%');
                  });
            });
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        
        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $orders = $query->latest()->get();

        $csvData = [];
        $csvData[] = [
            'Order Number',
            'Customer Name',
            'Customer Email',
            'Status',
            'Total Amount',
            'Items Count',
            'Order Date',
            'Shipping Address'
        ];

        foreach ($orders as $order) {
            $csvData[] = [
                $order->order_number,
                $order->user->name,
                $order->user->email,
                ucfirst($order->status),
                number_format($order->total_amount, 2),
                $order->orderItems->count(),
                $order->created_at->format('Y-m-d H:i:s'),
                is_array($order->shipping_address) 
                    ? implode(', ', array_filter($order->shipping_address))
                    : $order->shipping_address
            ];
        }

        $filename = 'orders_export_' . date('Y-m-d_H-i-s') . '.csv';
        
        $handle = fopen('php://output', 'w');
        
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        
        foreach ($csvData as $row) {
            fputcsv($handle, $row);
        }
        
        fclose($handle);
        exit;
    }
}
