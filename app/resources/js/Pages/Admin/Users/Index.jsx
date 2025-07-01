import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ users, roleOptions, filters }) {
    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const search = formData.get('search');
        const role = formData.get('role');
        const dateFrom = formData.get('date_from');
        const dateTo = formData.get('date_to');

        router.get(route('admin.users.index'), {
            search: search || undefined,
            role: role || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        router.get(route('admin.users.index'));
    };

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
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const hasActiveFilters = filters.search || filters.role || filters.date_from || filters.date_to;

    return (
        <AdminLayout>
            <Head title="Users Management" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800">Users Management</h2>
                                    <p className="text-gray-600 mt-1">Manage system users and their roles</p>
                                </div>
                                <Link
                                    href={route('admin.users.create')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                >
                                    Add New User
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <form onSubmit={handleSearch} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                            Search Users
                                        </label>
                                        <input
                                            type="text"
                                            id="search"
                                            name="search"
                                            defaultValue={filters.search}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Search by name or email..."
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                            Role
                                        </label>
                                        <select
                                            id="role"
                                            name="role"
                                            defaultValue={filters.role}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">All Roles</option>
                                            {Object.entries(roleOptions).map(([value, label]) => (
                                                <option key={value} value={value}>{label}</option>
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
                                            name="date_from"
                                            defaultValue={filters.date_from}
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
                                            name="date_to"
                                            defaultValue={filters.date_to}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-2">
                                        <button
                                            type="submit"
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                        >
                                            Apply Filters
                                        </button>
                                        {hasActiveFilters && (
                                            <button
                                                type="button"
                                                onClick={clearFilters}
                                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition duration-200"
                                            >
                                                Clear Filters
                                            </button>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {users.total} users found
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Orders
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Joined
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                No users found
                                            </td>
                                        </tr>
                                    ) : (
                                        users.data.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                <span className="text-sm font-medium text-gray-700">
                                                                    {user.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {user.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        user.role === 'admin' 
                                                            ? 'bg-purple-100 text-purple-800' 
                                                            : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {roleOptions[user.role]}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        user.email_verified_at 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {user.email_verified_at ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {user.orders_count} orders
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(user.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Link
                                                            href={route('admin.users.show', user.id)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            View
                                                        </Link>
                                                        <Link
                                                            href={route('admin.users.edit', user.id)}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => toggleUserStatus(user.id)}
                                                            className={`${
                                                                user.email_verified_at 
                                                                    ? 'text-orange-600 hover:text-orange-900' 
                                                                    : 'text-green-600 hover:text-green-900'
                                                            }`}
                                                        >
                                                            {user.email_verified_at ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                        <button
                                                            onClick={() => deleteUser(user.id, user.name)}
                                                            className="text-red-600 hover:text-red-900"
                                                            disabled={user.orders_count > 0}
                                                            title={user.orders_count > 0 ? 'Cannot delete user with orders' : 'Delete user'}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {users.links && users.links.length > 3 && (
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        {users.prev_page_url && (
                                            <Link
                                                href={users.prev_page_url}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Previous
                                            </Link>
                                        )}
                                        {users.next_page_url && (
                                            <Link
                                                href={users.next_page_url}
                                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Next
                                            </Link>
                                        )}
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Showing <span className="font-medium">{users.from}</span> to{' '}
                                                <span className="font-medium">{users.to}</span> of{' '}
                                                <span className="font-medium">{users.total}</span> results
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                {users.links.map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`relative inline-flex items-center px-2 py-2 border text-sm font-medium ${
                                                            link.active
                                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                : link.url
                                                                ? 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                                                        } ${
                                                            index === 0 ? 'rounded-l-md' : ''
                                                        } ${
                                                            index === users.links.length - 1 ? 'rounded-r-md' : ''
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}