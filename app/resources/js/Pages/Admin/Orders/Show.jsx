import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ order }) {
    const [newStatus, setNewStatus] = useState(order.status);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(price);
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            processing: 'bg-purple-100 text-purple-800',
            shipped: 'bg-indigo-100 text-indigo-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };

        const statusLabels = {
            pending: 'Pending',
            confirmed: 'Confirmed',
            processing: 'Processing',
            shipped: 'Shipped',
            delivered: 'Delivered',
            cancelled: 'Cancelled'
        };

        return (
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                {statusLabels[status] || status}
            </span>
        );
    };

    const handleStatusUpdate = () => {
        if (newStatus === order.status) return;

        router.patch(route('admin.orders.updateStatus', order.id), {
            status: newStatus
        }, {
            onSuccess: () => {
                // Status updated successfully
            }
        });
    };

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    return (
        <AdminLayout>
            <Head title={`Order ${order.order_number}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800">Order Details</h2>
                                    <p className="text-gray-600 mt-1">Order #{order.order_number}</p>
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={route('admin.orders.index')}
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                    >
                                        Back to Orders
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Order Information */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Status & Management */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h3>
                                    
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div>
                                            <span className="text-sm text-gray-600">Current Status:</span>
                                            <div className="mt-1">
                                                {getStatusBadge(order.status)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="flex-1">
                                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                                Update Status
                                            </label>
                                            <select
                                                id="status"
                                                value={newStatus}
                                                onChange={(e) => setNewStatus(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                {statusOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="pt-6">
                                            <button
                                                onClick={handleStatusUpdate}
                                                disabled={newStatus === order.status}
                                                className={`px-4 py-2 rounded-md transition duration-200 ${
                                                    newStatus === order.status
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                }`}
                                            >
                                                Update Status
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
                                    
                                    <div className="space-y-4">
                                        {order.order_items?.map((item) => (
                                            <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{item.product?.name}</h4>
                                                    <p className="text-sm text-gray-500">
                                                        Category: {item.product?.category?.name || 'N/A'}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        SKU: {item.product?.id}
                                                    </p>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-sm text-gray-500">Quantity</div>
                                                    <div className="font-semibold">{item.quantity}</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-sm text-gray-500">Unit Price</div>
                                                    <div className="font-semibold">{formatPrice(item.price)}</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-sm text-gray-500">Subtotal</div>
                                                    <div className="font-semibold">{formatPrice(item.price * item.quantity)}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Total */}
                                    <div className="mt-6 pt-4 border-t border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                                            <span className="text-xl font-bold text-green-600">
                                                {formatPrice(order.total_amount)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Information */}
                        <div className="space-y-6">
                            {/* Customer Information */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h3>
                                    
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-sm text-gray-600">Name:</span>
                                            <div className="font-medium">{order.user?.name}</div>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Email:</span>
                                            <div className="font-medium">{order.user?.email}</div>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Customer ID:</span>
                                            <div className="font-medium">#{order.user?.id}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Information */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Shipping Information</h3>
                                    
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-sm text-gray-600">Shipping Address:</span>
                                            <div className="font-medium">
                                                {typeof order.shipping_address === 'object' ? (
                                                    <div className="space-y-1">
                                                        <div>{order.shipping_address.name}</div>
                                                        <div>{order.shipping_address.phone}</div>
                                                        <div>{order.shipping_address.address}</div>
                                                        <div>{order.shipping_address.city} {order.shipping_address.postal_code}</div>
                                                    </div>
                                                ) : (
                                                    <div className="whitespace-pre-line">{order.shipping_address}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Shipping Method:</span>
                                            <div className="font-medium">{order.shipping_method}</div>
                                        </div>
                                        {order.shipping_cost > 0 && (
                                            <div>
                                                <span className="text-sm text-gray-600">Shipping Cost:</span>
                                                <div className="font-medium">{formatPrice(order.shipping_cost)}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Order Metadata */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Details</h3>
                                    
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-sm text-gray-600">Order Number:</span>
                                            <div className="font-medium font-mono">{order.order_number}</div>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Order Date:</span>
                                            <div className="font-medium">
                                                {new Date(order.created_at).toLocaleString('id-ID')}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Last Updated:</span>
                                            <div className="font-medium">
                                                {new Date(order.updated_at).toLocaleString('id-ID')}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Total Items:</span>
                                            <div className="font-medium">{order.order_items?.length || 0} items</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}