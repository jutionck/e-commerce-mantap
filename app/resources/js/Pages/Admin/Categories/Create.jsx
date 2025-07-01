import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.categories.store'));
    };

    return (
        <AdminLayout>
            <Head title="Add New Category" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800">Add New Category</h2>
                                    <p className="text-gray-600 mt-1">Create a new product category</p>
                                </div>
                                <Link
                                    href={route('admin.categories.index')}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                >
                                    Back to Categories
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Category Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Category Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter category name"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                    <p className="mt-1 text-sm text-gray-500">
                                        The slug will be automatically generated from the category name
                                    </p>
                                </div>

                                {/* Preview */}
                                {data.name && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-sm text-gray-600">Category Name:</span>
                                                <span className="ml-2 font-medium">{data.name}</span>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Slug:</span>
                                                <span className="ml-2 font-mono text-blue-600">
                                                    {data.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Information */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-blue-800">Category Guidelines</h3>
                                            <div className="mt-2 text-sm text-blue-700">
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Category names should be descriptive and unique</li>
                                                    <li>Use title case for better readability (e.g., "Electronics", "Home & Garden")</li>
                                                    <li>Avoid special characters that might cause URL issues</li>
                                                    <li>Keep names concise but descriptive</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                    <Link
                                        href={route('admin.categories.index')}
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
                                        {processing ? 'Creating...' : 'Create Category'}
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