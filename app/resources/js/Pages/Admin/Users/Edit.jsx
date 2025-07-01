import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role: user.role || 'customer',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
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

    return (
        <AdminLayout>
            <Head title={`Edit ${user.name}`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800">Edit User</h2>
                                    <p className="text-gray-600 mt-1">Update user information and settings</p>
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={route('admin.users.show', user.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                    >
                                        View User
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

                    {/* Form */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Personal Information */}
                                <div className="border-b border-gray-200 pb-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="Enter full name"
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="Enter email address"
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Password Update */}
                                <div className="border-b border-gray-200 pb-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Password Update</h3>
                                    <p className="text-sm text-gray-600 mb-4">Leave password fields empty to keep current password</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                id="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors.password ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="Enter new password"
                                            />
                                            {errors.password && (
                                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                            )}
                                            <p className="mt-1 text-sm text-gray-500">
                                                Minimum 8 characters if changing password
                                            </p>
                                        </div>

                                        <div>
                                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                id="password_confirmation"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="Confirm new password"
                                            />
                                            {errors.password_confirmation && (
                                                <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Role Management */}
                                <div className="border-b border-gray-200 pb-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Role Management</h3>
                                    
                                    <div>
                                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                            User Role *
                                        </label>
                                        <select
                                            id="role"
                                            value={data.role}
                                            onChange={(e) => setData('role', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.role ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="customer">Customer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        {errors.role && (
                                            <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                                        )}
                                        
                                        <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Role Permissions:</h4>
                                            {data.role === 'admin' ? (
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    <li>• Full access to admin panel</li>
                                                    <li>• Manage products, categories, and orders</li>
                                                    <li>• View and manage all users</li>
                                                    <li>• Access to reports and analytics</li>
                                                </ul>
                                            ) : (
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    <li>• Browse and purchase products</li>
                                                    <li>• Manage personal profile and orders</li>
                                                    <li>• Leave product reviews</li>
                                                    <li>• No admin panel access</li>
                                                </ul>
                                            )}
                                        </div>

                                        {/* Role Change Warning */}
                                        {user.role !== data.role && (
                                            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="text-sm font-medium text-yellow-800">Role Change Warning</h3>
                                                        <div className="mt-2 text-sm text-yellow-700">
                                                            <p>You are changing this user's role from <strong>{user.role}</strong> to <strong>{data.role}</strong>. 
                                                            This will {data.role === 'admin' ? 'grant admin privileges' : 'remove admin privileges'} immediately upon saving.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Current Information */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Current Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">User ID:</span>
                                            <span className="ml-2 font-medium">#{user.id}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Current Role:</span>
                                            <span className="ml-2 font-medium capitalize">{user.role}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Status:</span>
                                            <span className={`ml-2 font-medium ${user.email_verified_at ? 'text-green-600' : 'text-red-600'}`}>
                                                {user.email_verified_at ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Total Orders:</span>
                                            <span className="ml-2 font-medium">{user.orders_count || 0}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Joined:</span>
                                            <span className="ml-2">{formatDate(user.created_at)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Last Updated:</span>
                                            <span className="ml-2">{formatDate(user.updated_at)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                    <Link
                                        href={route('admin.users.index')}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition duration-200"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`px-6 py-2 rounded-lg text-white transition duration-200 ${
                                            processing
                                                ? 'bg-blue-400 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                    >
                                        {processing ? 'Updating...' : 'Update User'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}