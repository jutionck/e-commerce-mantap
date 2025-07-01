import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category_id: '',
        description: '',
        price: '',
        stock: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.products.store'));
    };

    return (
        <AdminLayout>
            <Head title="Add New Product" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800">Add New Product</h2>
                                    <p className="text-gray-600 mt-1">Create a new product for your store</p>
                                </div>
                                <Link
                                    href={route('admin.products.index')}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                >
                                    Back to Products
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Product Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter product name"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                {/* Category */}
                                <div>
                                    <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                                        Category *
                                    </label>
                                    <select
                                        id="category_id"
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.category_id ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
                                    )}
                                </div>

                                {/* Price and Stock */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                            Price (IDR) *
                                        </label>
                                        <input
                                            type="number"
                                            id="price"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            min="0"
                                            step="0.01"
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.price ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="0.00"
                                        />
                                        {errors.price && (
                                            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                                            Stock Quantity *
                                        </label>
                                        <input
                                            type="number"
                                            id="stock"
                                            value={data.stock}
                                            onChange={(e) => setData('stock', e.target.value)}
                                            min="0"
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.stock ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="0"
                                        />
                                        {errors.stock && (
                                            <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows="4"
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.description ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter product description..."
                                    ></textarea>
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                    <Link
                                        href={route('admin.products.index')}
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
                                        {processing ? 'Creating...' : 'Create Product'}
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