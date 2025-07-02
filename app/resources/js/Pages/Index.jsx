import React, { useState, useMemo } from 'react';
import { Link, Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/Select';
import Carousel from '@/Components/Carousel';
import FlashSaleSection from '@/Components/FlashSaleSection';
import CountdownTimer from '@/Components/CountdownTimer';

export default function Index({ auth, products, categories }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [viewMode, setViewMode] = useState('grid');

    // Filter dan sort products
    const filteredProducts = useMemo(() => {
        let filtered = enhancedProducts;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory && selectedCategory !== 'all') {
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
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0);
                case 'stock':
                    return b.stock - a.stock;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [enhancedProducts, searchTerm, selectedCategory, sortBy]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-600' };
        if (stock <= 10) return { text: 'Low Stock', color: 'bg-orange-100 text-orange-600' };
        return { text: 'In Stock', color: 'bg-green-100 text-green-600' };
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setSortBy('name');
    };

    const hasActiveFilters = searchTerm || selectedCategory !== 'all' || sortBy !== 'name';

    // Enhanced product data with ratings for demonstration
    const enhancedProducts = products.map(product => ({
        ...product,
        rating: product.rating || (4.0 + Math.random() * 1.0), // Demo ratings
        reviews: product.reviews || Math.floor(Math.random() * 200) + 10,
        highlights: product.highlights || [], // Demo highlights
        soldCount: product.soldCount || Math.floor(Math.random() * 100) + 20
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <PublicLayout user={auth?.user}>
                <Head title="Enhanced Product Catalog" />

                {/* Hero Carousel Section - Full Width */}
                <div className="w-full">
                    <Carousel />
                </div>

                {/* Flash Sale Section */}
                <FlashSaleSection />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Enhanced Search Bar */}
                    <div className="mb-8">
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <Input
                                    type="text"
                                    placeholder="Search for products, brands, categories..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 text-base bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-lg"
                                />
                                {searchTerm && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Filter Section */}
                    <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                    {/* Category Filter */}
                                    <div className="flex-1">
                                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="All Categories" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Categories</SelectItem>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        <div className="flex items-center gap-2">
                                                            <span>📦</span>
                                                            <span>{category.name}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Sort Filter */}
                                    <div className="flex-1">
                                        <Select value={sortBy} onValueChange={setSortBy}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Sort by" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="name">Name (A-Z)</SelectItem>
                                                <SelectItem value="price_low">Price (Low to High)</SelectItem>
                                                <SelectItem value="price_high">Price (High to Low)</SelectItem>
                                                <SelectItem value="rating">Highest Rated</SelectItem>
                                                <SelectItem value="stock">Stock Level</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Results Count & Actions */}
                                <div className="flex items-center gap-4">
                                    <Badge variant="outline" className="text-sm">
                                        {filteredProducts.length} products found
                                    </Badge>

                                    {/* View Mode Toggle */}
                                    <div className="flex border rounded-lg overflow-hidden">
                                        <Button
                                            variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                            size="sm"
                                            onClick={() => setViewMode('grid')}
                                            className="rounded-none"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                            </svg>
                                        </Button>
                                        <Button
                                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                                            size="sm"
                                            onClick={() => setViewMode('list')}
                                            className="rounded-none"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                            </svg>
                                        </Button>
                                    </div>

                                    {hasActiveFilters && (
                                        <Button variant="outline" size="sm" onClick={clearFilters} className="gap-2 bg-transparent">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Clear Filters
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Enhanced Categories Quick Links */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <Card
                                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                                    selectedCategory === 'all' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                                }`}
                                onClick={() => setSelectedCategory('all')}
                            >
                                <CardContent className="p-4 text-center">
                                    <div className="text-3xl mb-2">🛍️</div>
                                    <div className="text-sm font-medium">All Products</div>
                                    <div className="text-xs text-gray-500 mt-1">{products.length} items</div>
                                </CardContent>
                            </Card>

                            {categories.map((category) => (
                                <Card
                                    key={category.id}
                                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                                        selectedCategory === category.id.toString() ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                                    }`}
                                    onClick={() => setSelectedCategory(category.id.toString())}
                                >
                                    <CardContent className="p-4 text-center">
                                        <div className="text-3xl mb-2">📦</div>
                                        <div className="text-sm font-medium">{category.name}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {products.filter(p => p.category.id === category.id).length} items
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Enhanced Products Grid */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                            {filteredProducts.length > 0 && (
                                <div className="text-sm text-gray-500">
                                    Showing {filteredProducts.length} of {products.length} products
                                </div>
                            )}
                        </div>

                        {filteredProducts.length === 0 ? (
                            <Card className="text-center py-16">
                                <CardContent>
                                    <svg className="mx-auto h-24 w-24 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m2-1h8m-8 0V3a1 1 0 011-1h6a1 1 0 011 1v1M7 21h10" />
                                    </svg>
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                                    <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                                    <Button onClick={clearFilters} className="gap-2">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Clear All Filters
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div
                                className={`grid gap-6 ${
                                    viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'
                                }`}
                            >
                                {filteredProducts.map((product) => {
                                    const stockStatus = getStockStatus(product.stock);

                                    return (
                                        <Card
                                            key={product.id}
                                            className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm"
                                        >
                                            <CardContent className="p-0">
                                                {viewMode === 'grid' ? (
                                                    <>
                                                        {/* Product Image */}
                                                        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                                            <Link href={`/products/${product.id}`}>
                                                                <img
                                                                    src={product.primary_image || product.image || "/images/product_placeholder.svg"}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                                />
                                                            </Link>

                                                            {/* Enhanced Badges */}
                                                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                                                                {/* Trending Badge */}
                                                                {product.soldCount > 50 && (
                                                                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-xs px-2 py-1 shadow-lg">
                                                                        <span className="mr-1">📱</span>
                                                                        Trending
                                                                    </Badge>
                                                                )}

                                                                {/* Discount Badge */}
                                                                {product.originalPrice && product.originalPrice > product.price && (
                                                                    <Badge className="bg-red-500 text-white font-bold text-xs px-2 py-1">
                                                                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                                                                    </Badge>
                                                                )}
                                                            </div>

                                                            <div className="absolute top-3 right-3">
                                                                <Badge className={stockStatus.color}>{stockStatus.text}</Badge>
                                                            </div>

                                                            {/* Quick Actions */}
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                                <Button size="sm" className="gap-2">
                                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L12 21l2.5-3H7z" />
                                                                    </svg>
                                                                    Add to Cart
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {/* Product Info */}
                                                        <div className="p-4">
                                                            <Badge variant="outline" className="text-xs mb-2">
                                                                {product.category.name}
                                                            </Badge>

                                                            <Link href={`/products/${product.id}`}>
                                                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                                    {product.name}
                                                                </h3>
                                                            </Link>

                                                            {product.description && (
                                                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                                                            )}

                                                            {/* Rating */}
                                                            <div className="flex items-center gap-1 mb-3">
                                                                <div className="flex">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <svg
                                                                            key={i}
                                                                            className={`h-4 w-4 ${
                                                                                i < Math.floor(product.rating)
                                                                                    ? 'text-yellow-400 fill-current'
                                                                                    : 'text-gray-300'
                                                                            }`}
                                                                            fill="currentColor"
                                                                            viewBox="0 0 20 20"
                                                                        >
                                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                        </svg>
                                                                    ))}
                                                                </div>
                                                                <span className="text-sm text-gray-600">
                                                                    {product.rating.toFixed(1)} ({product.reviews} reviews)
                                                                </span>
                                                            </div>

                                                            {/* Enhanced Price & Stock */}
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</div>
                                                                        {product.originalPrice && product.originalPrice > product.price && (
                                                                            <div className="text-sm text-gray-500 line-through">
                                                                                {formatPrice(product.originalPrice)}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                        <span>{product.stock} in stock</span>
                                                                        {product.soldCount && (
                                                                            <span className="text-green-600 font-medium">• {product.soldCount} sold</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Popularity Progress Bar */}
                                                            {product.soldCount && product.soldCount > 50 && (
                                                                <div className="mt-3">
                                                                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                                                        <span>Popular item</span>
                                                                        <span>{product.soldCount} sold</span>
                                                                    </div>
                                                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                                        <div
                                                                            className="bg-gradient-to-r from-green-400 to-green-600 h-1.5 rounded-full transition-all duration-300"
                                                                            style={{ width: `${Math.min((product.soldCount / 150) * 100, 100)}%` }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </>
                                                ) : (
                                                    // List View
                                                    <div className="flex gap-4 p-4">
                                                        <div className="relative w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                            <Link href={`/products/${product.id}`}>
                                                                <img
                                                                    src={product.primary_image || product.image || "/images/product_placeholder.svg"}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </Link>
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <Badge variant="outline" className="text-xs mb-1">
                                                                        {product.category.name}
                                                                    </Badge>
                                                                    <Link href={`/products/${product.id}`}>
                                                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                                                                    </Link>
                                                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>

                                                                    <div className="flex items-center gap-1 mb-2">
                                                                        <div className="flex">
                                                                            {[...Array(5)].map((_, i) => (
                                                                                <svg
                                                                                    key={i}
                                                                                    className={`h-3 w-3 ${
                                                                                        i < Math.floor(product.rating)
                                                                                            ? 'text-yellow-400 fill-current'
                                                                                            : 'text-gray-300'
                                                                                    }`}
                                                                                    fill="currentColor"
                                                                                    viewBox="0 0 20 20"
                                                                                >
                                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                                </svg>
                                                                            ))}
                                                                        </div>
                                                                        <span className="text-xs text-gray-600">({product.reviews})</span>
                                                                    </div>
                                                                </div>

                                                                <div className="text-right ml-4">
                                                                    <div className="text-xl font-bold text-gray-900 mb-1">{formatPrice(product.price)}</div>
                                                                    <Badge className={`${stockStatus.color} mb-2`}>
                                                                        {stockStatus.text}
                                                                    </Badge>
                                                                    <div className="text-xs text-gray-500 mb-2">{product.stock} in stock</div>
                                                                    <Button size="sm" className="gap-2">
                                                                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L12 21l2.5-3H7z" />
                                                                        </svg>
                                                                        Add to Cart
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                </div>

                    </div>

                    {/* Full Width Features Section */}
                    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 py-16 mt-12">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Shop With Us?</h2>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    Experience the best online shopping with our commitment to quality, speed, and customer satisfaction
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                                <div className="text-center group">
                                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast Delivery</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Quick and reliable shipping to your doorstep with real-time tracking. Free delivery on orders over IDR 500,000
                                    </p>
                                </div>

                                <div className="text-center group">
                                    <div className="bg-gradient-to-r from-green-500 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Products</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Carefully curated products with guaranteed quality and authenticity. 30-day return policy for your peace of mind
                                    </p>
                                </div>

                                <div className="text-center group">
                                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Support</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Round-the-clock customer service support via chat, email, and phone. Our team is always ready to help
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
            </PublicLayout>
        </div>
    );
}