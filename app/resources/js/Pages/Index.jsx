import React, { useState, useMemo } from 'react';
import { Link, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Index({ auth, products, categories }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('name');

    // Filter dan sort products
    const filteredProducts = useMemo(() => {
        let filtered = products;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(product => product.category.id.toString() === selectedCategory);
        }

        // Sort products
        filtered = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'price_low':
                    return a.price - b.price;
                case 'price_high':
                    return b.price - a.price;
                case 'stock':
                    return b.stock - a.stock;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [products, searchTerm, selectedCategory, sortBy]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-100' };
        if (stock <= 10) return { text: 'Low Stock', color: 'text-orange-600 bg-orange-100' };
        return { text: 'In Stock', color: 'text-green-600 bg-green-100' };
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSortBy('name');
    };

    const Layout = auth?.user ? AuthenticatedLayout : GuestLayout;

    return (
        <Layout user={auth?.user}>
            <Head title="Product Catalog" />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            Welcome to Our Store
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100">
                            Discover amazing products at great prices
                        </p>
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-6 py-4 text-gray-900 bg-white rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
                                />
                                <svg
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filter Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            {/* Category Filter */}
                            <div className="flex-1">
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort Filter */}
                            <div className="flex-1">
                                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                                    Sort By
                                </label>
                                <select
                                    id="sort"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="name">Name (A-Z)</option>
                                    <option value="price_low">Price (Low to High)</option>
                                    <option value="price_high">Price (High to Low)</option>
                                    <option value="stock">Stock Level</option>
                                </select>
                            </div>
                        </div>

                        {/* Clear Filters & Results Count */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                                {filteredProducts.length} products found
                            </span>
                            {(searchTerm || selectedCategory || sortBy !== 'name') && (
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-200"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Categories Quick Links */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Shop by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <button
                            onClick={() => setSelectedCategory('')}
                            className={`p-4 rounded-lg border-2 transition duration-200 ${
                                selectedCategory === ''
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                        >
                            <div className="text-center">
                                <div className="text-2xl mb-2">🛍️</div>
                                <div className="text-sm font-medium">All Products</div>
                            </div>
                        </button>
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id.toString())}
                                className={`p-4 rounded-lg border-2 transition duration-200 ${
                                    selectedCategory === category.id.toString()
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                }`}
                            >
                                <div className="text-center">
                                    <div className="text-2xl mb-2">📦</div>
                                    <div className="text-sm font-medium">{category.name}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Products</h2>
                    
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-gray-400 mb-4">
                                <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m2-1h8m-8 0V3a1 1 0 011-1h6a1 1 0 011 1v1M7 21h10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                            <button
                                onClick={clearFilters}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map(product => {
                                const stockStatus = getStockStatus(product.stock);
                                return (
                                    <div
                                        key={product.id}
                                        className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                                    >
                                        <Link href={`/products/${product.id}`} className="block">
                                            {/* Product Image */}
                                            <div className="relative h-48 bg-gray-100 overflow-hidden">
                                                <img
                                                    src="/images/product_placeholder.png"
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                {/* Stock Badge */}
                                                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                                                    {stockStatus.text}
                                                </div>
                                                {/* Discount Badge (if applicable) */}
                                                {product.discount && (
                                                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                                        -{product.discount}%
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-4">
                                                {/* Category */}
                                                <div className="text-xs text-blue-600 font-medium mb-1 uppercase tracking-wide">
                                                    {product.category.name}
                                                </div>

                                                {/* Product Name */}
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                    {product.name}
                                                </h3>

                                                {/* Description */}
                                                {product.description && (
                                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                        {product.description}
                                                    </p>
                                                )}

                                                {/* Price & Stock */}
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="text-xl font-bold text-gray-900">
                                                            {formatPrice(product.price)}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {product.stock} in stock
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Quick Add Button */}
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <div className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Features Section */}
                <div className="bg-gray-50 rounded-2xl p-8 mt-12">
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Why Shop With Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Delivery</h3>
                            <p className="text-gray-600">Quick and reliable shipping to your doorstep</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Products</h3>
                            <p className="text-gray-600">Carefully curated products with guaranteed quality</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
                            <p className="text-gray-600">Round-the-clock customer service support</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}