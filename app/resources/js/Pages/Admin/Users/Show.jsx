import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ user }) {
    const toggleUserStatus = (userId) => {
        if (confirm('Are you sure you want to toggle this user\'s status?')) {
            router.post(route('admin.users.toggle-status', userId));
        }
    };

    const deleteUser = (userId, userName) => {
        if (confirm(`Are you sure you want to delete "${userName}"? This action cannot be undone.`)) {
            router.delete(route('admin.users.destroy', userId));
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    return (
        <AdminLayout>
            <Head title={`User: ${user.name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800">User Details</h2>
                                    <p className="text-gray-600 mt-1">View and manage user information</p>
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={route('admin.users.edit', user.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                    >
                                        Edit User
                                    </Link>
                                    <Link
                                        href={route('admin.users.index')}
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                    >
                                        Back to Users
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* User Information */}
                        <div className="lg:col-span-2">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                                <div className="p-6">
                                    <div className="flex items-center mb-6">
                                        <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center mr-6">
                                            <span className="text-2xl font-bold text-gray-700">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
                                            <p className="text-gray-600">{user.email}</p>
                                            <div className="flex items-center mt-2 space-x-4">
                                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                                    user.role === 'admin' 
                                                        ? 'bg-purple-100 text-purple-800' 
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {user.role === 'admin' ? 'Administrator' : 'Customer'}
                                                </span>
                                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                                    user.email_verified_at 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {user.email_verified_at ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-6">
                                        <h4 className="text-lg font-medium text-gray-900 mb-4">Account Information</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">User ID</dt>
                                                <dd className="mt-1 text-sm text-gray-900">#{user.id}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Email Status</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {user.email_verified_at ? `Verified on ${formatDate(user.email_verified_at)}` : 'Not Verified'}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Account Created</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{formatDate(user.created_at)}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{formatDate(user.updated_at)}</dd>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Orders History */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-lg font-medium text-gray-900">Order History</h4>
                                        <span className="text-sm text-gray-500">
                                            {user.orders ? user.orders.length : 0} orders
                                        </span>
                                    </div>

                                    {user.orders && user.orders.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Order
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Date
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Total
                                                        </th>
                                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {user.orders.map((order) => (
                                                        <tr key={order.id} className="hover:bg-gray-50">
                                                            <td className="px-4 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    #{order.order_number}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-900">
                                                                    {formatDate(order.created_at)}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                                    order.status === 'shipped' ? 'bg-yellow-100 text-yellow-800' :
                                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                    {order.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-900">
                                                                    {formatCurrency(order.total)}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <Link
                                                                    href={route('admin.orders.show', order.id)}
                                                                    className="text-blue-600 hover:text-blue-900"
                                                                >
                                                                    View
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="text-gray-500">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                                                <p className="mt-1 text-sm text-gray-500">This user hasn't placed any orders.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions Panel */}
                        <div className="lg:col-span-1">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                                <div className="p-6">
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h4>
                                    <div className="space-y-3">
                                        <Link
                                            href={route('admin.users.edit', user.id)}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 text-center block"
                                        >
                                            Edit User
                                        </Link>
                                        <button
                                            onClick={() => toggleUserStatus(user.id)}
                                            className={`w-full px-4 py-2 rounded-lg transition duration-200 ${
                                                user.email_verified_at 
                                                    ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                            }`}
                                        >
                                            {user.email_verified_at ? 'Deactivate User' : 'Activate User'}
                                        </button>
                                        <button
                                            onClick={() => deleteUser(user.id, user.name)}
                                            disabled={user.orders_count > 0}
                                            className={`w-full px-4 py-2 rounded-lg transition duration-200 ${
                                                user.orders_count > 0
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-red-600 hover:bg-red-700 text-white'
                                            }`}
                                            title={user.orders_count > 0 ? 'Cannot delete user with orders' : 'Delete user'}
                                        >
                                            Delete User
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Statistics */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">User Statistics</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Total Orders</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {user.orders_count || 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Total Spent</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {formatCurrency(user.total_spent || 0)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Account Age</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {Math.floor((new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24))} days
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Last Login</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {user.last_login_at ? formatDate(user.last_login_at) : 'Never'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Admin Notes */}
                            {user.role === 'admin' && (
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-purple-800">Admin User</h3>
                                            <div className="mt-2 text-sm text-purple-700">
                                                <p>This user has administrator privileges and can access the admin panel.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}