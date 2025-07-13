import React, { useState } from 'react';
import { useForm, Link, Head, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';

function CartItem({ item, productId }) {
    const { data, setData, patch, delete: destroy, processing } = useForm({
        quantity: item.quantity,
    });
    const [isUpdating, setIsUpdating] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    function handleUpdate() {
        setIsUpdating(true);
        patch(route('cart.update', productId), {
            preserveState: true,
            onFinish: () => setIsUpdating(false)
        });
    }

    function handleRemove() {
        destroy(route('cart.destroy', productId), {
            preserveState: true
        });
    }

    const handleQuantityChange = (newQuantity) => {
        const quantity = Math.max(1, newQuantity);
        setData('quantity', quantity);
    };

    const handleQuantityChangeAndUpdate = (newQuantity) => {
        const quantity = Math.max(1, newQuantity);
        setData('quantity', quantity);
        // Directly make a request with the new quantity
        setIsUpdating(true);
        router.patch(route('cart.update', productId), {
            quantity: quantity
        }, {
            preserveState: true,
            onFinish: () => setIsUpdating(false)
        });
    };

    return (
        <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden group">
                        <img 
                            src={item.image || "/images/product_placeholder.png"}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                        />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                            {formatPrice(item.price)} per item
                        </p>
                        <div className="text-xl font-bold text-blue-600">
                            {formatPrice(item.price * item.quantity)}
                        </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 bg-gray-50 rounded-xl p-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChangeAndUpdate(data.quantity - 1)}
                                disabled={data.quantity <= 1 || processing}
                                className="w-8 h-8 rounded-lg border-0 hover:bg-gray-200 disabled:opacity-50"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                            </Button>
                            
                            <input
                                type="number"
                                value={data.quantity}
                                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                onBlur={handleUpdate}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleUpdate();
                                    }
                                }}
                                disabled={processing}
                                className="w-16 text-center border-0 bg-transparent text-sm font-medium focus:outline-none disabled:opacity-50"
                                min="1"
                            />
                            
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChangeAndUpdate(data.quantity + 1)}
                                disabled={processing}
                                className="w-8 h-8 rounded-lg border-0 hover:bg-gray-200 disabled:opacity-50"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </Button>
                        </div>
                        
                        {isUpdating && (
                            <div className="text-blue-600 text-sm">
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Remove Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemove} 
                        disabled={processing}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 disabled:opacity-50 rounded-lg"
                        title="Remove from cart"
                    >
                        {processing ? (
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function Index({ auth, cart }) {
    const cartItems = Object.entries(cart);
    const total = Object.values(cart).reduce((acc, item) => acc + item.price * item.quantity, 0);
    const itemCount = cartItems.reduce((total, [, item]) => total + parseInt(item.quantity), 0);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <PublicLayout user={auth?.user}>
            <Head title="Shopping Cart" />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="mb-8" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2 text-sm text-gray-600">
                        <li>
                            <Link href="/" className="hover:text-gray-900 transition-colors">
                                Home
                            </Link>
                        </li>
                        <li className="flex items-center">
                            <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-900 font-medium">Shopping Cart</span>
                        </li>
                    </ol>
                </nav>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                        Shopping Cart
                    </h1>
                    <p className="text-gray-600">
                        {cartItems.length === 0 ? 'Your cart is empty' : `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart`}
                    </p>
                </div>

                {cartItems.length === 0 ? (
                    /* Enhanced Empty Cart State */
                    <Card className="text-center py-16 border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
                        <CardContent className="p-8">
                            <div className="mb-8">
                                <div className="relative">
                                    <svg className="mx-auto h-32 w-32 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H2m5 8v6a2 2 0 002 2h6a2 2 0 002-2v-6M9 21h6" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-6xl">🛒</div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                Your cart is empty
                            </h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                                Discover amazing products and start building your perfect cart. Great deals are waiting for you!
                            </p>
                            <div className="space-y-4">
                                <Button asChild size="lg" className="gap-2">
                                    <Link href="/">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                        </svg>
                                        Start Shopping
                                    </Link>
                                </Button>
                                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Free shipping</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Secure checkout</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map(([productId, item]) => (
                                <CartItem key={productId} productId={productId} item={item} />
                            ))}
                        </div>

                        {/* Enhanced Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="border-0 shadow-lg sticky top-8 bg-gradient-to-br from-white to-gray-50">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Order Summary
                                        </h2>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                                                <span className="font-semibold text-gray-900">{formatPrice(total)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-600">Shipping</span>
                                                    <Badge variant="secondary" className="text-xs">Free</Badge>
                                                </div>
                                                <span className="text-green-600 font-semibold">FREE</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Tax</span>
                                                <span className="text-gray-600">Calculated at checkout</span>
                                            </div>
                                        </div>
                                        
                                        <div className="border-t pt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xl font-bold text-gray-900">Total</span>
                                                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{formatPrice(total)}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">Including all taxes and fees</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-3">
                                        {auth?.user ? (
                                            <Button asChild size="lg" className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                                                <Link href={route('checkout.index')}>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    Proceed to Checkout
                                                </Link>
                                            </Button>
                                        ) : (
                                            <div className="space-y-3">
                                                <Button asChild size="lg" className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                                    <Link href={route('login')}>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                        </svg>
                                                        Sign In to Checkout
                                                    </Link>
                                                </Button>
                                                <p className="text-sm text-gray-500 text-center">
                                                    New customer?{' '}
                                                    <Link href={route('register')} className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                                                        Create an account
                                                    </Link>
                                                </p>
                                            </div>
                                        )}
                                        
                                        <Button asChild variant="outline" size="lg" className="w-full gap-2 border-2 hover:bg-gray-50">
                                            <Link href="/">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                                </svg>
                                                Continue Shopping
                                            </Link>
                                        </Button>
                                        
                                        {/* Trust Badges */}
                                        <div className="flex items-center justify-center space-x-4 pt-4 border-t">
                                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>SSL Secure</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                                <span>Free Shipping</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Security & Trust Badges */}
                {cartItems.length > 0 && (
                    <div className="mt-12 bg-gray-50 rounded-2xl p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div className="flex items-center justify-center space-x-3">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Secure Checkout</p>
                                    <p className="text-sm text-gray-600">SSL encrypted payment</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-center space-x-3">
                                <div className="bg-blue-100 p-2 rounded-full">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Free Shipping</p>
                                    <p className="text-sm text-gray-600">On all orders</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-center space-x-3">
                                <div className="bg-purple-100 p-2 rounded-full">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Easy Returns</p>
                                    <p className="text-sm text-gray-600">30-day return policy</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
