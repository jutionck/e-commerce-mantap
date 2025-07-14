import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import WishlistButton from '@/Components/WishlistButton';
import { ShoppingCart, Heart, Package } from 'lucide-react';

export default function Index({ auth, wishlistItems = [] }) {
    const addToCart = (productId, quantity = 1) => {
        router.post('/cart', {
            product_id: productId,
            quantity: quantity
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                // Show success toast
                const toast = document.createElement('div');
                toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
                toast.innerHTML = `
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Product added to cart!</span>
                `;
                document.body.appendChild(toast);
                setTimeout(() => {
                    toast.style.transform = 'translateX(100%)';
                    setTimeout(() => document.body.removeChild(toast), 300);
                }, 3000);
            },
            onError: () => {
                const toast = document.createElement('div');
                toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                toast.innerHTML = 'Failed to add product to cart.';
                document.body.appendChild(toast);
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 3000);
            }
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (wishlistItems.length === 0) {
        return (
            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Wishlist</h2>}
            >
                <Head title="My Wishlist" />

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        {/* Empty State */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-12 text-center">
                                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                    <Heart className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    Save products you love by clicking the heart icon on any product. 
                                    They'll appear here for easy access later.
                                </p>
                                <Link href={route('home')}>
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        <Package className="w-4 h-4 mr-2" />
                                        Browse Products
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">My Wishlist</h2>
                    <Badge variant="secondary" className="text-sm">
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                    </Badge>
                </div>
            }
        >
            <Head title="My Wishlist" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Wishlist Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {wishlistItems.map((product) => (
                                    <Card key={product.id} className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
                                        <div className="relative">
                                            {/* Product Image */}
                                            <Link href={`/products/${product.id}`} className="block">
                                                <div className="aspect-square bg-gray-100 overflow-hidden">
                                                    <img
                                                        src={product.primary_image || product.image || '/images/product_placeholder.svg'}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            e.target.src = '/images/product_placeholder.svg';
                                                        }}
                                                    />
                                                </div>
                                            </Link>

                                            {/* Wishlist Button */}
                                            <div className="absolute top-3 right-3 z-10">
                                                <WishlistButton 
                                                    product={product}
                                                    isWishlisted={true}
                                                    size="sm"
                                                />
                                            </div>

                                            {/* Stock Badge */}
                                            {product.stock <= 5 && product.stock > 0 && (
                                                <div className="absolute top-3 left-3">
                                                    <Badge className="bg-orange-500 text-white text-xs">
                                                        Only {product.stock} left
                                                    </Badge>
                                                </div>
                                            )}

                                            {/* Out of Stock */}
                                            {product.stock === 0 && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <Badge className="bg-red-500 text-white">
                                                        Out of Stock
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>

                                        <CardContent className="p-4">
                                            {/* Category */}
                                            <Badge variant="outline" className="text-xs mb-2">
                                                {product.category?.name || 'Uncategorized'}
                                            </Badge>

                                            {/* Product Title */}
                                            <Link href={`/products/${product.id}`}>
                                                <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                                                    {product.name}
                                                </h3>
                                            </Link>

                                            {/* Description */}
                                            <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                                                {product.description}
                                            </p>

                                            {/* Price */}
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <span className="text-lg font-bold text-gray-900">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                    {product.originalPrice && product.originalPrice > product.price && (
                                                        <span className="text-sm text-gray-500 line-through ml-2">
                                                            {formatPrice(product.originalPrice)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {product.stock} in stock
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => addToCart(product.id)}
                                                    disabled={product.stock === 0}
                                                    className="flex-1 h-9 text-sm"
                                                >
                                                    <ShoppingCart className="w-4 h-4 mr-1" />
                                                    Add to Cart
                                                </Button>
                                                <Link href={`/products/${product.id}`}>
                                                    <Button variant="outline" size="sm" className="h-9 px-3">
                                                        View
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Continue Shopping */}
                            <div className="mt-8 text-center border-t pt-8">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Looking for more products?
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Continue browsing our collection to find more items you'll love.
                                </p>
                                <Link href={route('home')}>
                                    <Button variant="outline" className="mx-auto">
                                        <Package className="w-4 h-4 mr-2" />
                                        Continue Shopping
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}