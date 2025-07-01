import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ products, categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.products.index'), {
            search: search,
            category: category
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleDelete = (product) => {
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

    return (
        <AdminLayout>
            <Head title="Product Management" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800">Product Management</h2>
                                    <p className="text-gray-600 mt-1">Manage your product inventory</p>
                                </div>
                                <Link
                                    href={route('admin.products.create')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                >
                                    Add New Product
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Search & Filter */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <form onSubmit={handleSearch} className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                        Search Products
                                    </label>
                                    <input
                                        type="text"
                                        id="search"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search by name or description..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="w-48">
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition duration-200"
                                >
                                    Search
                                </button>
                                {(search || category) && (
                                    <Link
                                        href={route('admin.products.index')}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition duration-200"
                                    >
                                        Clear
                                    </Link>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {products.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-500 text-lg mb-4">No products found</div>
                                    <Link
                                        href={route('admin.products.create')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                    >
                                        Add Your First Product
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Product
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Category
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Price
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Stock
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {products.data.map((product) => (
                                                    <tr key={product.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {product.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {product.description ? 
                                                                        product.description.length > 50 ? 
                                                                            product.description.substring(0, 50) + '...' 
                                                                            : product.description
                                                                        : 'No description'
                                                                    }
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="inline-flex px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                                                                {product.category?.name || 'Uncategorized'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {formatPrice(product.price)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                product.stock > 10 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : product.stock > 0 
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {product.stock} units
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex space-x-2">
                                                                <Link
                                                                    href={route('admin.products.show', product.id)}
                                                                    className="text-blue-600 hover:text-blue-900"
                                                                >
                                                                    View
                                                                </Link>
                                                                <Link
                                                                    href={route('admin.products.edit', product.id)}
                                                                    className="text-green-600 hover:text-green-900"
                                                                >
                                                                    Edit
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(product)}
                                                                    className="text-red-600 hover:text-red-900"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {products.links && (
                                        <div className="mt-6 flex justify-between items-center">
                                            <div className="text-sm text-gray-700">
                                                Showing {products.from} to {products.to} of {products.total} results
                                            </div>
                                            <div className="flex space-x-1">
                                                {products.links.map((link, index) => (
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