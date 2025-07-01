import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ category }) {
    const handleDelete = () => {
        if (category.products_count > 0) {
            alert(`Cannot delete category "${category.name}" because it has ${category.products_count} products. Please move or delete products first.`);
            return;
        }

        if (confirm(`Are you sure you want to delete "${category.name}" category?`)) {
            router.delete(route('admin.categories.destroy', category.id));
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
            <Head title={`Category: ${category.name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800">Category Details</h2>
                                    <p className="text-gray-600 mt-1">View category information and products</p>
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={route('admin.categories.edit', category.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                    >
                                        Edit Category
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

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Category Information */}
                        <div className="lg:col-span-1">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Information</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Category Name</label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">{category.name}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">URL Slug</label>
                                            <p className="mt-1 text-sm font-mono bg-gray-100 px-2 py-1 rounded text-blue-600">
                                                {category.slug}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Products Count</label>
                                            <div className="mt-1 flex items-center space-x-2">
                                                <span className="text-xl font-semibold text-gray-900">
                                                    {category.products_count}
                                                </span>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    category.products_count > 0 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {category.products_count > 0 ? 'Active' : 'Empty'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Category Metadata */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Metadata</h3>
                                    
                                    <div className="space-y-3">
                                        <div className="bg-gray-50 p-3 rounded">
                                            <label className="block text-sm font-medium text-gray-600">Category ID</label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">#{category.id}</p>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded">
                                            <label className="block text-sm font-medium text-gray-600">Created Date</label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {new Date(category.created_at).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded">
                                            <label className="block text-sm font-medium text-gray-600">Last Updated</label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {new Date(category.updated_at).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
                                    
                                    <div className="space-y-3">
                                        <Link
                                            href={route('admin.categories.edit', category.id)}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 text-center block"
                                        >
                                            Edit Category
                                        </Link>
                                        
                                        <Link
                                            href={route('admin.categories.create')}
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-200 text-center block"
                                        >
                                            Create New Category
                                        </Link>

                                        <button
                                            onClick={handleDelete}
                                            disabled={category.products_count > 0}
                                            className={`w-full px-4 py-2 rounded-lg transition duration-200 ${
                                                category.products_count > 0
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-red-600 hover:bg-red-700 text-white'
                                            }`}
                                            title={category.products_count > 0 ? 'Cannot delete category with products' : 'Delete category'}
                                        >
                                            {category.products_count > 0 ? 'Cannot Delete (Has Products)' : 'Delete Category'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products in Category */}
                        <div className="lg:col-span-2">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Products in This Category</h3>
                                        <Link
                                            href={route('admin.products.create')}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition duration-200"
                                        >
                                            Add Product to Category
                                        </Link>
                                    </div>
                                    
                                    {category.products && category.products.length > 0 ? (
                                        <>
                                            <div className="space-y-4">
                                                {category.products.map((product) => (
                                                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <h4 className="font-medium text-gray-900">{product.name}</h4>
                                                                <p className="text-sm text-gray-500 mt-1">
                                                                    {product.description ? 
                                                                        product.description.length > 100 ? 
                                                                            product.description.substring(0, 100) + '...' 
                                                                            : product.description
                                                                        : 'No description'
                                                                    }
                                                                </p>
                                                                <div className="flex items-center space-x-4 mt-2">
                                                                    <span className="text-sm font-semibold text-green-600">
                                                                        {formatPrice(product.price)}
                                                                    </span>
                                                                    <span className="text-sm text-gray-500">
                                                                        Stock: {product.stock}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex space-x-2 ml-4">
                                                                <Link
                                                                    href={route('admin.products.show', product.id)}
                                                                    className="text-blue-600 hover:text-blue-900 text-sm"
                                                                >
                                                                    View
                                                                </Link>
                                                                <Link
                                                                    href={route('admin.products.edit', product.id)}
                                                                    className="text-green-600 hover:text-green-900 text-sm"
                                                                >
                                                                    Edit
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {category.products_count > 10 && (
                                                <div className="mt-6 text-center">
                                                    <Link
                                                        href={route('admin.products.index', { category: category.id })}
                                                        className="text-blue-600 hover:text-blue-900 text-sm"
                                                    >
                                                        View all {category.products_count} products in this category →
                                                    </Link>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="text-gray-500 text-lg mb-4">No products in this category</div>
                                            <Link
                                                href={route('admin.products.create')}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                            >
                                                Add First Product
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}