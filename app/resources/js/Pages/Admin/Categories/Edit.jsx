import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ category }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.categories.update', category.id));
    };

    return (
        <AdminLayout>
            <Head title={`Edit ${category.name}`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800">Edit Category</h2>
                                    <p className="text-gray-600 mt-1">Update category information</p>
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={route('admin.categories.show', category.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                    >
                                        View Category
                                    </Link>
                                    <Link
                                        href={route('admin.categories.index')}
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                    >
                                        Back to Categories
                                    </Link>
                                </div>
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
                                        The slug will be automatically updated from the category name
                                    </p>
                                </div>

                                {/* Preview */}
                                {data.name && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-sm text-gray-600">New Name:</span>
                                                <div className="font-medium">{data.name}</div>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">New Slug:</span>
                                                <div className="font-mono text-blue-600">
                                                    {data.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Current Information */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Current Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Category ID:</span>
                                            <span className="ml-2 font-medium">#{category.id}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Current Slug:</span>
                                            <span className="ml-2 font-mono text-blue-600">{category.slug}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Created:</span>
                                            <span className="ml-2">{new Date(category.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Updated:</span>
                                            <span className="ml-2">{new Date(category.updated_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Warning for categories with products */}
                                {category.products_count > 0 && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                                                <div className="mt-2 text-sm text-yellow-700">
                                                    <p>This category currently has <strong>{category.products_count} products</strong>. 
                                                    Changing the name will update the slug, which may affect URLs if you're using category-based routing.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

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
                                        {processing ? 'Updating...' : 'Update Category'}
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