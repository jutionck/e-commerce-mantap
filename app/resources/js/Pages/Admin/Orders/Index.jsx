import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ orders, statusOptions, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.orders.index'), {
            search: search,
            status: status,
            date_from: dateFrom,
            date_to: dateTo
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleExport = () => {
        const params = new URLSearchParams({
            search: search,
            status: status,
            date_from: dateFrom,
            date_to: dateTo
        });
        
        window.open(route('admin.orders.export') + '?' + params.toString());
    };

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

        return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                {statusOptions[status] || status}
            </span>
        );
    };

    return (
        <AdminLayout>
            <Head title="Order Management" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800">Order Management</h2>
                                    <p className="text-gray-600 mt-1">Manage customer orders and track fulfillment</p>
                                </div>
                                <button
                                    onClick={handleExport}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                >
                                    Export Orders
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Search & Filter */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <form onSubmit={handleSearch} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                            Search Orders
                                        </label>
                                        <input
                                            type="text"
                                            id="search"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Order number, customer name..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">All Status</option>
                                            {Object.entries(statusOptions).map(([value, label]) => (
                                                <option key={value} value={value}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="date_from" className="block text-sm font-medium text-gray-700 mb-1">
                                            From Date
                                        </label>
                                        <input
                                            type="date"
                                            id="date_from"
                                            value={dateFrom}
                                            onChange={(e) => setDateFrom(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="date_to" className="block text-sm font-medium text-gray-700 mb-1">
                                            To Date
                                        </label>
                                        <input
                                            type="date"
                                            id="date_to"
                                            value={dateTo}
                                            onChange={(e) => setDateTo(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition duration-200"
                                    >
                                        Search
                                    </button>
                                    {(search || status || dateFrom || dateTo) && (
                                        <Link
                                            href={route('admin.orders.index')}
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition duration-200"
                                        >
                                            Clear Filters
                                        </Link>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {orders.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-500 text-lg mb-4">No orders found</div>
                                    {(search || status || dateFrom || dateTo) ? (
                                        <p className="text-gray-400">Try adjusting your search filters</p>
                                    ) : (
                                        <p className="text-gray-400">No orders have been placed yet</p>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Order
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Customer
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Total
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Items
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Date
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {orders.data.map((order) => (
                                                    <tr key={order.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {order.order_number}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    ID: #{order.id}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {order.user?.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {order.user?.email}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {getStatusBadge(order.status)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {formatPrice(order.total_amount)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {order.order_items?.length || 0} items
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(order.created_at).toLocaleDateString('id-ID')}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <Link
                                                                href={route('admin.orders.show', order.id)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                View Details
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {orders.links && (
                                        <div className="mt-6 flex justify-between items-center">
                                            <div className="text-sm text-gray-700">
                                                Showing {orders.from} to {orders.to} of {orders.total} results
                                            </div>
                                            <div className="flex space-x-1">
                                                {orders.links.map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`px-3 py-2 text-sm rounded-md ${
                                                            link.active
                                                                ? 'bg-blue-600 text-white'
                                                                : link.url
                                                                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}