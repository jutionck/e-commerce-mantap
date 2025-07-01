import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ product }) {
    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
            router.delete(route('admin.products.destroy', product.id));
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(price);
    };

    const getStockStatus = (stock) => {
        if (stock > 10) return { color: 'green', text: 'In Stock' };
        if (stock > 0) return { color: 'yellow', text: 'Low Stock' };
        return { color: 'red', text: 'Out of Stock' };
    };

    const stockStatus = getStockStatus(product.stock);

    return (
        <AdminLayout>
            <Head title={`Product: ${product.name}`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800">Product Details</h2>
                                    <p className="text-gray-600 mt-1">View product information</p>
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={route('admin.products.edit', product.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                    >
                                        Edit Product
                                    </Link>
                                    <Link
                                        href={route('admin.products.index')}
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                    >
                                        Back to Products
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Information */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Basic Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Product Name</label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">{product.name}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Category</label>
                                            <span className="mt-1 inline-flex px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800 rounded-full">
                                                {product.category?.name || 'Uncategorized'}
                                            </span>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Product Slug</label>
                                            <p className="mt-1 text-sm font-mono bg-gray-100 px-2 py-1 rounded text-blue-600">
                                                {product.slug}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Description</label>
                                            <p className="mt-1 text-gray-700">
                                                {product.description || 'No description provided'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing & Inventory */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing & Inventory</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Price</label>
                                            <p className="mt-1 text-2xl font-bold text-green-600">
                                                {formatPrice(product.price)}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Stock Quantity</label>
                                            <div className="mt-1 flex items-center space-x-2">
                                                <span className="text-xl font-semibold text-gray-900">
                                                    {product.stock} units
                                                </span>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${stockStatus.color}-100 text-${stockStatus.color}-800`}>
                                                    {stockStatus.text}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Stock Value</label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">
                                                {formatPrice(product.price * product.stock)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Total value of remaining inventory
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Metadata */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Metadata</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <label className="block text-sm font-medium text-gray-600">Product ID</label>
                                    <p className="mt-1 text-lg font-semibold text-gray-900">#{product.id}</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <label className="block text-sm font-medium text-gray-600">Created Date</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {new Date(product.created_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <label className="block text-sm font-medium text-gray-600">Last Updated</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {new Date(product.updated_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <label className="block text-sm font-medium text-gray-600">Category ID</label>
                                    <p className="mt-1 text-lg font-semibold text-gray-900">#{product.category_id}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
                            
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href={route('admin.products.edit', product.id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
                                >
                                    Edit Product
                                </Link>
                                
                                <Link
                                    href={route('products.show', product.slug)}
                                    target="_blank"
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition duration-200"
                                >
                                    View in Store
                                </Link>

                                <Link
                                    href={route('admin.products.create')}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition duration-200"
                                >
                                    Create Similar
                                </Link>

                                <button
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition duration-200"
                                >
                                    Delete Product
                                </button>
                            </div>

                            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-yellow-800">Important Notes</h3>
                                        <div className="mt-2 text-sm text-yellow-700">
                                            <ul className="list-disc pl-5 space-y-1">
                                                <li>Deleting this product will permanently remove it from your store</li>
                                                <li>Any pending orders containing this product will not be affected</li>
                                                <li>Consider disabling the product by setting stock to 0 instead of deleting</li>
                                            </ul>
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