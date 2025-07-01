import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'customer',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AdminLayout>
            <Head title="Add New User" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800">Add New User</h2>
                                    <p className="text-gray-600 mt-1">Create a new user account</p>
                                </div>
                                <Link
                                    href={route('admin.users.index')}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                >
                                    Back to Users
                                </Link>
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

                                {/* Account Information */}
                                <div className="border-b border-gray-200 pb-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                                Password *
                                            </label>
                                            <input
                                                type="password"
                                                id="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors.password ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="Enter password"
                                            />
                                            {errors.password && (
                                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                            )}
                                            <p className="mt-1 text-sm text-gray-500">
                                                Minimum 8 characters required
                                            </p>
                                        </div>

                                        <div>
                                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                                                Confirm Password *
                                            </label>
                                            <input
                                                type="password"
                                                id="password_confirmation"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="Confirm password"
                                            />
                                            {errors.password_confirmation && (
                                                <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Role Assignment */}
                                <div className="pb-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Role Assignment</h3>
                                    
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
                                    </div>
                                </div>

                                {/* Important Notice */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-blue-800">Important Notice</h3>
                                            <div className="mt-2 text-sm text-blue-700">
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>The user account will be automatically verified upon creation</li>
                                                    <li>Admin users will have immediate access to the admin panel</li>
                                                    <li>User will receive login credentials and can change password later</li>
                                                    <li>You can modify user roles and status after creation</li>
                                                </ul>
                                            </div>
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
                                        {processing ? 'Creating...' : 'Create User'}
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