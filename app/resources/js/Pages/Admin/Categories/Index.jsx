import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.categories.index'), {
            search: search
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleDelete = (category) => {
        if (confirm(`Are you sure you want to delete "${category.name}" category?`)) {
            router.delete(route('admin.categories.destroy', category.id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Category Management" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800">Category Management</h2>
                                    <p className="text-gray-600 mt-1">Manage product categories</p>
                                </div>
                                <Link
                                    href={route('admin.categories.create')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                >
                                    Add New Category
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <form onSubmit={handleSearch} className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                        Search Categories
                                    </label>
                                    <input
                                        type="text"
                                        id="search"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search by category name..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition duration-200"
                                >
                                    Search
                                </button>
                                {search && (
                                    <Link
                                        href={route('admin.categories.index')}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition duration-200"
                                    >
                                        Clear
                                    </Link>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Categories Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {categories.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-500 text-lg mb-4">No categories found</div>
                                    <Link
                                        href={route('admin.categories.create')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                    >
                                        Add Your First Category
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Category
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Slug
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Products Count
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Created
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {categories.data.map((category) => (
                                                    <tr key={category.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {category.name}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-500 font-mono">
                                                                {category.slug}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                category.products_count > 0 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {category.products_count} products
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(category.created_at).toLocaleDateString('id-ID')}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex space-x-2">
                                                                <Link
                                                                    href={route('admin.categories.show', category.id)}
                                                                    className="text-blue-600 hover:text-blue-900"
                                                                >
                                                                    View
                                                                </Link>
                                                                <Link
                                                                    href={route('admin.categories.edit', category.id)}
                                                                    className="text-green-600 hover:text-green-900"
                                                                >
                                                                    Edit
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(category)}
                                                                    disabled={category.products_count > 0}
                                                                    className={`${
                                                                        category.products_count > 0
                                                                            ? 'text-gray-400 cursor-not-allowed'
                                                                            : 'text-red-600 hover:text-red-900'
                                                                    }`}
                                                                    title={category.products_count > 0 ? 'Cannot delete category with products' : 'Delete category'}
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
                                    {categories.links && (
                                        <div className="mt-6 flex justify-between items-center">
                                            <div className="text-sm text-gray-700">
                                                Showing {categories.from} to {categories.to} of {categories.total} results
                                            </div>
                                            <div className="flex space-x-1">
                                                {categories.links.map((link, index) => (
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