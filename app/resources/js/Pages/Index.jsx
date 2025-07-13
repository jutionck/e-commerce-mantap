import React, { useState, useMemo } from "react";
import { Link, Head, router } from "@inertiajs/react";
import { Card, CardContent } from "@/Components/ui/Card";
import { Badge } from "@/Components/ui/Badge";
import { Button } from "@/Components/ui/Button";
import { Input } from "@/Components/ui/Input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/Select";
import Dropdown from "@/Components/Dropdown";
import Carousel from "@/Components/Carousel";
import FlashSaleSection from "@/Components/FlashSaleSection";
import CartIcon from "@/Components/CartIcon";
import { AuthModals } from "@/Components/Auth/AuthModals";

export default function Index({ auth, products = [], categories = [], cart = [] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [viewMode, setViewMode] = useState("grid");
    const [loadingProduct, setLoadingProduct] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    // Calculate cart count
    const cartCount = cart ? Object.values(cart).reduce((total, item) => total + item.quantity, 0) : 0;

    // Add to cart function with loading state
    const addToCart = (productId, quantity = 1) => {
        setLoadingProduct(productId);
        router.post('/cart', {
            product_id: productId,
            quantity: quantity
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['cart'],
            onSuccess: () => {
                // Show success message with better UI
                const product = enhancedProducts.find(p => p.id === productId);
                const toast = document.createElement('div');
                toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
                toast.innerHTML = `
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>${product?.name || 'Product'} added to cart!</span>
                `;
                document.body.appendChild(toast);
                setTimeout(() => {
                    toast.style.transform = 'translateX(100%)';
                    setTimeout(() => document.body.removeChild(toast), 300);
                }, 3000);
                setLoadingProduct(null);
            },
            onError: () => {
                const toast = document.createElement('div');
                toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
                toast.innerHTML = `
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span>Failed to add product to cart.</span>
                `;
                document.body.appendChild(toast);
                setTimeout(() => {
                    toast.style.transform = 'translateX(100%)';
                    setTimeout(() => document.body.removeChild(toast), 300);
                }, 3000);
                setLoadingProduct(null);
            }
        });
    };

    // Enhanced product data with ratings for demonstration
    const enhancedProducts = useMemo(() => {
        if (!products || !Array.isArray(products)) return [];

        return products.map((product) => ({
            ...product,
            rating: product.rating || 4.0 + Math.random() * 1.0, // Demo ratings
            reviews: product.reviews || Math.floor(Math.random() * 200) + 10,
            highlights: product.highlights || [], // Demo highlights
            soldCount:
                product.soldCount || Math.floor(Math.random() * 100) + 20,
        }));
    }, [products]);

    // Filter dan sort products
    const filteredProducts = useMemo(() => {
        let filtered = enhancedProducts;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (product) =>
                    product.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    product.description
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory && selectedCategory !== "all") {
            filtered = filtered.filter(
                (product) =>
                    product.category &&
                    product.category.id &&
                    product.category.id.toString() === selectedCategory
            );
        }

        // Sort products
        filtered = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.name.localeCompare(b.name);
                case "price_low":
                    return a.price - b.price;
                case "price_high":
                    return b.price - a.price;
                case "rating":
                    return (b.rating || 0) - (a.rating || 0);
                case "stock":
                    return b.stock - a.stock;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [enhancedProducts, searchTerm, selectedCategory, sortBy]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getStockStatus = (stock) => {
        if (stock === 0)
            return { text: "Out of Stock", color: "bg-red-100 text-red-600" };
        if (stock <= 10)
            return {
                text: "Low Stock",
                color: "bg-orange-100 text-orange-600",
            };
        return { text: "In Stock", color: "bg-green-100 text-green-600" };
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("all");
        setSortBy("name");
    };

    const hasActiveFilters =
        searchTerm || selectedCategory !== "all" || sortBy !== "name";

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Store - Your Online Shopping Destination" />

            {/* Simplified Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-gray-900">Store</span>
                        </div>

                        {/* Search Bar */}
                        <div className="hidden md:flex flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <svg
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                <Input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            {/* Categories Dropdown - Simple */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <Button variant="ghost" size="sm" className="hidden md:flex">
                                        Categories
                                        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </Button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right" width="48">
                                    <Dropdown.Link onClick={() => setSelectedCategory("all")}>
                                        All Categories
                                    </Dropdown.Link>
                                    {categories && categories.map((category) => (
                                        <Dropdown.Link 
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id.toString())}
                                        >
                                            {category.name}
                                        </Dropdown.Link>
                                    ))}
                                </Dropdown.Content>
                            </Dropdown>

                            {/* Cart */}
                            <CartIcon cart={cart} />

                                {/* Authentication Buttons */}
                                {auth?.user ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-700 hidden md:block">
                                            Welcome, {auth.user.name}
                                        </span>
                                        
                                        {/* Single User Menu Dropdown */}
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    <span className="hidden sm:inline">My Account</span>
                                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </Button>
                                            </Dropdown.Trigger>
                                            <Dropdown.Content align="right" width="56">
                                                <div className="px-4 py-3 border-b">
                                                    <div className="font-medium text-base text-gray-800">{auth.user.name}</div>
                                                    <div className="font-medium text-sm text-gray-500">{auth.user.email}</div>
                                                </div>
                                                <Dropdown.Link href="/dashboard">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                                    </svg>
                                                    Dashboard
                                                </Dropdown.Link>
                                                <Dropdown.Link href="/orders">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                    </svg>
                                                    My Orders
                                                </Dropdown.Link>
                                                <Dropdown.Link href="/profile">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    Profile Settings
                                                </Dropdown.Link>
                                                {auth.user.role === 'admin' && (
                                                    <Dropdown.Link href="/admin">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        Admin Panel
                                                    </Dropdown.Link>
                                                )}
                                                <div className="border-t"></div>
                                                <button
                                                    onClick={() => router.post("/logout")}
                                                    className="w-full text-left px-4 py-2 text-sm leading-5 text-red-700 hover:bg-red-50 focus:outline-none focus:bg-red-50 transition duration-150 ease-in-out flex items-center"
                                                >
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    Sign Out
                                                </button>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-700 hover:text-blue-600 font-medium"
                                            onClick={() => setIsLoginModalOpen(true)}
                                        >
                                            Sign In
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-3 md:px-6 font-medium text-sm"
                                            onClick={() => setIsRegisterModalOpen(true)}
                                        >
                                            Register
                                        </Button>
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* Mobile Search Bar */}
                    <div className="md:hidden pb-4">
                        <div className="relative">
                            <svg
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <Input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-2.5 text-base bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors"
                            />
                            {searchTerm && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100"
                                >
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Carousel Section - Full Width */}
            <div className="w-full">
                <Carousel />
            </div>

            {/* Flash Sale Section */}
            {/* <FlashSaleSection /> */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Simple Filter Bar */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold text-gray-900">
                            {filteredProducts.length} Products
                        </span>
                    </div>
                    
                    <div className="flex gap-3">
                        {/* Simple Sort */}
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name">Name</SelectItem>
                                <SelectItem value="price_low">Price: Low</SelectItem>
                                <SelectItem value="price_high">Price: High</SelectItem>
                                <SelectItem value="rating">Rating</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* View Toggle */}
                        <div className="flex border rounded-md">
                            <Button
                                variant={viewMode === "grid" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewMode("grid")}
                                className="rounded-r-none"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewMode("list")}
                                className="rounded-l-none"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            </Button>
                        </div>
                    </div>
                </div>


                {/* Enhanced Products Grid */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Products
                        </h2>
                        {filteredProducts.length > 0 && (
                            <div className="text-sm text-gray-500">
                                Showing {filteredProducts.length} of{" "}
                                {products ? products.length : 0} products
                            </div>
                        )}
                    </div>

                    {filteredProducts.length === 0 ? (
                        <Card className="text-center py-16">
                            <CardContent>
                                <svg
                                    className="mx-auto h-24 w-24 text-gray-300 mb-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m2-1h8m-8 0V3a1 1 0 011-1h6a1 1 0 011 1v1M7 21h10"
                                    />
                                </svg>
                                <h3 className="text-xl font-medium text-gray-900 mb-2">
                                    No products found
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    Try adjusting your search or filter criteria
                                </p>
                                <Button
                                    onClick={clearFilters}
                                    className="gap-2"
                                >
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                    Clear All Filters
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div
                            className={`grid gap-6 ${
                                viewMode === "grid"
                                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                    : "grid-cols-1"
                            }`}
                        >
                            {filteredProducts.map((product) => {
                                const stockStatus = getStockStatus(
                                    product.stock
                                );

                                return (
                                    <Card
                                        key={product.id}
                                        className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm"
                                    >
                                        <CardContent className="p-0">
                                            {viewMode === "grid" ? (
                                                <>
                                                    {/* Product Image */}
                                                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                                        <Link
                                                            href={`/products/${product.id}`}
                                                        >
                                                            <img
                                                                src={
                                                                    product.primary_image ||
                                                                    product.image ||
                                                                    "/images/product_placeholder.svg"
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                                onError={(
                                                                    e
                                                                ) => {
                                                                    e.target.src =
                                                                        "/images/product_placeholder.svg";
                                                                }}
                                                                loading="lazy"
                                                            />
                                                        </Link>
                                                        
                                                        {/* Wishlist Button */}
                                                        <button
                                                            className="absolute top-3 right-12 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all duration-200 hover:scale-110"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                // Add to wishlist functionality here
                                                            }}
                                                        >
                                                            <svg className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                            </svg>
                                                        </button>

                                                        {/* Simple Stock Badge */}
                                                        {product.stock <= 5 && product.stock > 0 && (
                                                            <div className="absolute top-3 left-3">
                                                                <Badge className="bg-orange-500 text-white text-xs">
                                                                    Low Stock
                                                                </Badge>
                                                            </div>
                                                        )}
                                                        
                                                        {product.stock === 0 && (
                                                            <div className="absolute top-3 left-3">
                                                                <Badge className="bg-red-500 text-white text-xs">
                                                                    Out of Stock
                                                                </Badge>
                                                            </div>
                                                        )}

                                                        {/* Quick Actions */}
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                            <Button
                                                                size="sm"
                                                                className="gap-2"
                                                                disabled={loadingProduct === product.id || product.stock === 0}
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    addToCart(product.id);
                                                                }}
                                                            >
                                                                {loadingProduct === product.id ? (
                                                                    <>
                                                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                                        </svg>
                                                                        Adding...
                                                                    </>
                                                                ) : product.stock === 0 ? (
                                                                    <>
                                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                        </svg>
                                                                        Out of Stock
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <svg
                                                                            className="h-4 w-4"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L12 21l2.5-3H7z"
                                                                            />
                                                                        </svg>
                                                                        Add to Cart
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="p-4">
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs mb-2"
                                                        >
                                                            {product.category
                                                                ?.name ||
                                                                "Uncategorized"}
                                                        </Badge>

                                                        <Link
                                                            href={`/products/${product.id}`}
                                                        >
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                                {product.name}
                                                            </h3>
                                                        </Link>

                                                        {product.description && (
                                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                                {
                                                                    product.description
                                                                }
                                                            </p>
                                                        )}

                                                        {/* Rating */}
                                                        <div className="flex items-center gap-1 mb-3">
                                                            <div className="flex">
                                                                {[
                                                                    ...Array(5),
                                                                ].map(
                                                                    (_, i) => (
                                                                        <svg
                                                                            key={
                                                                                i
                                                                            }
                                                                            className={`h-4 w-4 ${
                                                                                i <
                                                                                Math.floor(
                                                                                    product.rating
                                                                                )
                                                                                    ? "text-yellow-400 fill-current"
                                                                                    : "text-gray-300"
                                                                            }`}
                                                                            fill="currentColor"
                                                                            viewBox="0 0 20 20"
                                                                        >
                                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                        </svg>
                                                                    )
                                                                )}
                                                            </div>
                                                            <span className="text-sm text-gray-600">
                                                                {product.rating.toFixed(
                                                                    1
                                                                )}{" "}
                                                                (
                                                                {
                                                                    product.reviews
                                                                }{" "}
                                                                reviews)
                                                            </span>
                                                        </div>

                                                        {/* Enhanced Price & Stock */}
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="text-xl font-bold text-gray-900">
                                                                        {formatPrice(
                                                                            product.price
                                                                        )}
                                                                    </div>
                                                                    {product.originalPrice &&
                                                                        product.originalPrice >
                                                                            product.price && (
                                                                            <div className="text-sm text-gray-500 line-through">
                                                                                {formatPrice(
                                                                                    product.originalPrice
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                    <span>
                                                                        {
                                                                            product.stock
                                                                        }{" "}
                                                                        in stock
                                                                    </span>
                                                                    {product.soldCount && (
                                                                        <span className="text-green-600 font-medium">
                                                                            •{" "}
                                                                            {
                                                                                product.soldCount
                                                                            }{" "}
                                                                            sold
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Popularity Progress Bar */}
                                                        {product.soldCount &&
                                                            product.soldCount >
                                                                50 && (
                                                                <div className="mt-3">
                                                                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                                                        <span>
                                                                            Popular
                                                                            item
                                                                        </span>
                                                                        <span>
                                                                            {
                                                                                product.soldCount
                                                                            }{" "}
                                                                            sold
                                                                        </span>
                                                                    </div>
                                                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                                        <div
                                                                            className="bg-gradient-to-r from-green-400 to-green-600 h-1.5 rounded-full transition-all duration-300"
                                                                            style={{
                                                                                width: `${Math.min(
                                                                                    (product.soldCount /
                                                                                        150) *
                                                                                        100,
                                                                                    100
                                                                                )}%`,
                                                                            }}
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
                                                        <Link
                                                            href={`/products/${product.id}`}
                                                        >
                                                            <img
                                                                src={
                                                                    product.primary_image ||
                                                                    product.image ||
                                                                    "/images/product_placeholder.svg"
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                                className="w-full h-full object-cover"
                                                                onError={(
                                                                    e
                                                                ) => {
                                                                    e.target.src =
                                                                        "/images/product_placeholder.svg";
                                                                }}
                                                            />
                                                        </Link>
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs mb-1"
                                                                >
                                                                    {product
                                                                        .category
                                                                        ?.name ||
                                                                        "Uncategorized"}
                                                                </Badge>
                                                                <Link
                                                                    href={`/products/${product.id}`}
                                                                >
                                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                                        {
                                                                            product.name
                                                                        }
                                                                    </h3>
                                                                </Link>
                                                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                                    {
                                                                        product.description
                                                                    }
                                                                </p>

                                                                <div className="flex items-center gap-1 mb-2">
                                                                    <div className="flex">
                                                                        {[
                                                                            ...Array(
                                                                                5
                                                                            ),
                                                                        ].map(
                                                                            (
                                                                                _,
                                                                                i
                                                                            ) => (
                                                                                <svg
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    className={`h-3 w-3 ${
                                                                                        i <
                                                                                        Math.floor(
                                                                                            product.rating
                                                                                        )
                                                                                            ? "text-yellow-400 fill-current"
                                                                                            : "text-gray-300"
                                                                                    }`}
                                                                                    fill="currentColor"
                                                                                    viewBox="0 0 20 20"
                                                                                >
                                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                                </svg>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                    <span className="text-xs text-gray-600">
                                                                        (
                                                                        {
                                                                            product.reviews
                                                                        }
                                                                        )
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="text-right ml-4">
                                                                <div className="text-xl font-bold text-gray-900 mb-1">
                                                                    {formatPrice(
                                                                        product.price
                                                                    )}
                                                                </div>
                                                                <Badge
                                                                    className={`${stockStatus.color} mb-2`}
                                                                >
                                                                    {
                                                                        stockStatus.text
                                                                    }
                                                                </Badge>
                                                                <div className="text-xs text-gray-500 mb-2">
                                                                    {
                                                                        product.stock
                                                                    }{" "}
                                                                    in stock
                                                                </div>
                                                                <Button
                                                                    size="sm"
                                                                    className="gap-2"
                                                                    disabled={loadingProduct === product.id || product.stock === 0}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        addToCart(product.id);
                                                                    }}
                                                                >
                                                                    {loadingProduct === product.id ? (
                                                                        <>
                                                                            <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                                            </svg>
                                                                            Adding...
                                                                        </>
                                                                    ) : product.stock === 0 ? (
                                                                        <>
                                                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                            </svg>
                                                                            Out of Stock
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <svg
                                                                                className="h-3 w-3"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                viewBox="0 0 24 24"
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth={2}
                                                                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L12 21l2.5-3H7z"
                                                                                />
                                                                            </svg>
                                                                            Add to Cart
                                                                        </>
                                                                    )}
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

            {/* Payment & Shipping Methods Section */}
            <div className="bg-gray-50 py-12 border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Payment Methods */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-6">Metode Pembayaran</h3>
                            <div className="space-y-4">
                                {/* Bank Row 1 */}
                                <div className="flex items-center gap-4 flex-wrap">
                                    <div className="flex items-center justify-center w-16 h-10 bg-white border border-gray-200 rounded">
                                        {/* TODO: Replace with logo <img src="/images/logos/bca-logo.svg" alt="BCA" className="h-6" /> */}
                                        <span className="text-blue-600 font-bold text-sm">BCA</span>
                                    </div>
                                    <div className="flex items-center justify-center w-16 h-10 bg-white border border-gray-200 rounded">
                                        <span className="text-orange-600 font-bold text-sm">BNI</span>
                                    </div>
                                    <div className="flex items-center justify-center w-16 h-10 bg-white border border-gray-200 rounded">
                                        <span className="text-blue-800 font-bold text-sm">BRI</span>
                                    </div>
                                    <div className="flex items-center justify-center w-16 h-10 bg-white border border-gray-200 rounded">
                                        <span className="text-blue-500 font-bold text-xs">BSI</span>
                                    </div>
                                    <div className="flex items-center justify-center w-16 h-10 bg-white border border-gray-200 rounded">
                                        <span className="text-orange-500 font-bold text-xs">BTPN</span>
                                    </div>
                                    <div className="flex items-center justify-center w-16 h-10 bg-white border border-gray-200 rounded">
                                        <span className="text-red-600 font-bold text-xs">CIMB</span>
                                    </div>
                                    <div className="flex items-center justify-center w-16 h-10 bg-white border border-gray-200 rounded">
                                        <span className="text-blue-600 font-bold text-xs">DANAMON</span>
                                    </div>
                                </div>
                                
                                {/* E-Wallet Row 2 */}
                                <div className="flex items-center gap-4 flex-wrap">
                                    <div className="flex items-center justify-center w-16 h-10 bg-white border border-gray-200 rounded">
                                        <span className="text-blue-600 font-bold text-xs">HANA</span>
                                    </div>
                                    <div className="flex items-center justify-center w-16 h-10 bg-white border border-gray-200 rounded">
                                        <span className="text-blue-500 font-bold text-xs">JENIUS</span>
                                    </div>
                                    <div className="flex items-center justify-center w-16 h-10 bg-white border border-gray-200 rounded">
                                        <span className="text-blue-800 font-bold text-xs">MANDIRI</span>
                                    </div>
                                    <div className="flex items-center justify-center w-16 h-10 bg-white border border-gray-200 rounded">
                                        <span className="text-yellow-500 font-bold text-xs">MAYBANK</span>
                                    </div>
                                    <div className="flex items-center justify-center w-16 h-10 bg-white border border-gray-200 rounded">
                                        <span className="text-green-600 font-bold text-xs">PERMATA</span>
                                    </div>
                                    <div className="flex items-center justify-center w-16 h-10 bg-white border border-gray-200 rounded">
                                        <span className="text-blue-600 font-bold text-xs">DANA</span>
                                    </div>
                                    <div className="flex items-center justify-center w-16 h-10 bg-white border border-gray-200 rounded">
                                        <span className="text-red-500 font-bold text-xs">LinkAja</span>
                                    </div>
                                </div>

                                {/* Payment Methods Row 3 */}
                                <div className="flex items-center gap-4 flex-wrap">
                                    <div className="flex items-center justify-center w-16 h-10 bg-white border border-gray-200 rounded">
                                        <span className="text-purple-600 font-bold text-xs">OVO</span>
                                    </div>
                                    <div className="flex items-center justify-center w-16 h-10 bg-white border border-gray-200 rounded">
                                        <span className="text-red-600 font-bold text-xs">ShopeePay</span>
                                    </div>
                                    <div className="flex items-center justify-center w-16 h-10 bg-white border border-gray-200 rounded">
                                        <span className="text-red-500 font-bold text-xs">QRIS</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Methods */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-6">Jasa Pengiriman</h3>
                            <div className="space-y-4">
                                {/* Shipping Row 1 */}
                                <div className="flex items-center gap-4 flex-wrap">
                                    <div className="flex items-center justify-center w-16 h-10 bg-white border border-gray-200 rounded">
                                        {/* TODO: Replace with logo <img src="/images/logos/anteraja-logo.svg" alt="AnterAja" className="h-6" /> */}
                                        <span className="text-red-600 font-bold text-xs">AnterAja</span>
                                    </div>
                                    <div className="flex items-center justify-center w-16 h-10 bg-white border border-gray-200 rounded">
                                        <span className="text-green-600 font-bold text-xs">GoSend</span>
                                    </div>
                                    <div className="flex items-center justify-center w-16 h-10 bg-white border border-gray-200 rounded">
                                        <span className="text-red-600 font-bold text-xs">JNE</span>
                                    </div>
                                    <div className="flex items-center justify-center w-16 h-10 bg-white border border-gray-200 rounded">
                                        <span className="text-orange-600 font-bold text-xs">Paxel</span>
                                    </div>
                                    <div className="flex items-center justify-center w-16 h-10 bg-white border border-gray-200 rounded">
                                        <span className="text-red-500 font-bold text-xs">SiCepat</span>
                                    </div>
                                    <div className="flex items-center justify-center w-16 h-10 bg-white border border-gray-200 rounded">
                                        <span className="text-blue-600 font-bold text-xs">POS</span>
                                    </div>
                                    <div className="flex items-center justify-center w-16 h-10 bg-white border border-gray-200 rounded">
                                        <span className="text-red-600 font-bold text-xs">J&T</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Free Shipping Notice */}
                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <p className="text-sm text-blue-800">
                                        <span className="font-semibold">Gratis Ongkir</span> untuk pembelian minimal IDR 500,000
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Width Features Section */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Shop With Us?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Experience the best online shopping with our
                            commitment to quality, speed, and customer
                            satisfaction
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        <div className="text-center group">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <svg
                                    className="w-10 h-10 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Fast Delivery
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Quick and reliable shipping to your doorstep
                                with real-time tracking. Free delivery on orders
                                over IDR 500,000
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <svg
                                    className="w-10 h-10 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Quality Products
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Carefully curated products with guaranteed
                                quality and authenticity. 30-day return policy
                                for your peace of mind
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <svg
                                    className="w-10 h-10 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                24/7 Support
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Round-the-clock customer service support via
                                chat, email, and phone. Our team is always ready
                                to help
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                        />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold">Store</span>
                            </div>
                            <p className="text-gray-400 mb-4 leading-relaxed">
                                Your trusted online shopping destination for
                                quality products at great prices. We're
                                committed to providing the best shopping
                                experience.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="lg:col-span-1">
                            <h3 className="text-lg font-semibold mb-4">
                                Quick Links
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Button
                                        variant="ghost"
                                        className="text-gray-400 hover:text-white justify-start p-0"
                                    >
                                        About Us
                                    </Button>
                                </li>
                                <li>
                                    <Button
                                        variant="ghost"
                                        className="text-gray-400 hover:text-white justify-start p-0"
                                    >
                                        Contact Us
                                    </Button>
                                </li>
                                <li>
                                    <Button
                                        variant="ghost"
                                        className="text-gray-400 hover:text-white justify-start p-0"
                                    >
                                        Privacy Policy
                                    </Button>
                                </li>
                                <li>
                                    <Button
                                        variant="ghost"
                                        className="text-gray-400 hover:text-white justify-start p-0"
                                    >
                                        Terms of Service
                                    </Button>
                                </li>
                            </ul>
                        </div>

                        {/* Subscribe */}
                        <div className="lg:col-span-2">
                            <h3 className="text-lg font-semibold mb-4">
                                Subscribe to our Newsletter
                            </h3>
                            <p className="text-gray-400 mb-4">
                                Stay up to date with our latest offers and new
                                products.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Input
                                    type="email"
                                    placeholder="Your email address"
                                    className="bg-gray-800 border-gray-700 text-white flex-1"
                                />
                                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                    Subscribe
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
                        © 2024 Store. All rights reserved.
                    </div>
                </div>
            </footer>

            {/* Authentication Modals */}
            <AuthModals
                isLoginOpen={isLoginModalOpen}
                isRegisterOpen={isRegisterModalOpen}
                onClose={() => {
                    setIsLoginModalOpen(false);
                    setIsRegisterModalOpen(false);
                }}
                onSwitchToLogin={() => {
                    setIsRegisterModalOpen(false);
                    setIsLoginModalOpen(true);
                }}
                onSwitchToRegister={() => {
                    setIsLoginModalOpen(false);
                    setIsRegisterModalOpen(true);
                }}
            />
        </div>
    );
}
