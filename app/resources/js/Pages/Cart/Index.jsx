import React, { useState } from 'react';
import { useForm, Link, Head, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';
import { AuthModals } from '@/Components/Auth/AuthModals';

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
        <Card className="overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white via-gray-50/30 to-white group hover:scale-[1.01] sm:hover:scale-[1.02] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6 relative z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 md:space-x-4 lg:space-x-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-gray-100 via-white to-gray-100 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl ring-1 ring-gray-200/50 group-hover:ring-blue-300/60 transition-all duration-300">
                        <img 
                            src={item.image || "/images/product_placeholder.png"}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                        />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                        <div>
                            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">
                                {item.name}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2 sm:mb-3">
                                <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block w-fit">
                                    {formatPrice(item.price)} each
                                </span>
                                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium inline-block w-fit">
                                    In Stock
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
                            <div className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                                {formatPrice(item.price * item.quantity)}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">
                                ({item.quantity} × {formatPrice(item.price)})
                            </div>
                        </div>
                    </div>

                    {/* Quantity Controls & Remove Button */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                        <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-lg border border-gray-100 hover:border-blue-200 transition-all duration-300">
                            <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleQuantityChangeAndUpdate(data.quantity - 1)}
                                    disabled={data.quantity <= 1 || processing}
                                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-600 hover:text-red-700 border-0 disabled:opacity-50 shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                </Button>
                            
                                <div className="relative">
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
                                        className="w-12 h-8 sm:w-14 sm:h-9 md:w-16 md:h-10 text-center border-2 border-gray-200 bg-gray-50 text-sm sm:text-base md:text-lg font-bold text-gray-800 focus:outline-none focus:border-blue-400 focus:bg-white disabled:opacity-50 rounded-lg sm:rounded-xl transition-all duration-300"
                                        min="1"
                                    />
                                    {isUpdating && (
                                        <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-pulse"></div>
                                    )}
                                </div>
                            
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleQuantityChangeAndUpdate(data.quantity + 1)}
                                    disabled={processing}
                                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-600 hover:text-green-700 border-0 disabled:opacity-50 shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </Button>
                            </div>
                        </div>

                        {/* Remove Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemove} 
                            disabled={processing}
                            className="group/remove p-2 sm:p-3 text-gray-400 hover:text-red-500 bg-white hover:bg-red-50 transition-all duration-300 disabled:opacity-50 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:border-red-200 hover:shadow-xl w-full sm:w-auto justify-center"
                            title="Remove from cart"
                        >
                            <span className="flex items-center justify-center space-x-1 sm:space-x-0">
                                {processing ? (
                                    <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                ) : (
                                    <svg className="h-4 w-4 sm:h-5 sm:w-5 group-hover/remove:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                )}
                                <span className="text-xs sm:hidden ml-1">Remove</span>
                            </span>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function Index({ auth, cart }) {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    
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

    // Modal handlers
    const handleCloseModal = () => {
        setIsLoginModalOpen(false);
        setIsRegisterModalOpen(false);
    };

    const handleSwitchToRegister = () => {
        setIsLoginModalOpen(false);
        setIsRegisterModalOpen(true);
    };

    const handleSwitchToLogin = () => {
        setIsRegisterModalOpen(false);
        setIsLoginModalOpen(true);
    };

    return (
        <PublicLayout user={auth?.user}>
            <Head title="Shopping Cart" />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                
                <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
                    {/* Breadcrumb */}
                    <nav className="mb-4 sm:mb-6 md:mb-8" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                            <li>
                                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium">
                                    Home
                                </Link>
                            </li>
                            <li className="flex items-center">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-blue-600 font-bold">Shopping Cart</span>
                            </li>
                        </ol>
                    </nav>

                    {/* Header */}
                    <div className="text-center mb-4 sm:mb-6 md:mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg">
                            <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H2m5 8v6a2 2 0 002 2h6a2 2 0 002-2v-6M9 21h6" />
                            </svg>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent px-2">
                            Shopping Cart
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                            {cartItems.length === 0 ? 'Your cart is empty. Discover amazing products and start shopping!' : `Review your ${itemCount} selected item${itemCount !== 1 ? 's' : ''} and proceed to checkout`}
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 -mt-2 sm:-mt-4 relative">

                {cartItems.length === 0 ? (
                    /* Enhanced Empty Cart State */
                    <div className="text-center py-8 sm:py-12 md:py-16 lg:py-20">
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 mx-auto max-w-lg border border-gray-100 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-60"></div>
                            <div className="relative z-10">
                                <div className="mb-6 sm:mb-8">
                                    <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
                                        <div className="absolute inset-1 sm:inset-2 bg-white rounded-full flex items-center justify-center shadow-lg">
                                            <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H2m5 8v6a2 2 0 002 2h6a2 2 0 002-2v-6M9 21h6" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                                    Your cart is empty
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2">
                                    Discover amazing products and start building your perfect collection. Great deals are waiting for you!
                                </p>
                                <div className="space-y-4 sm:space-y-6">
                                    <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base">
                                        <Link href="/" className="flex items-center justify-center gap-2 sm:gap-3">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                            </svg>
                                            Start Shopping
                                        </Link>
                                    </Button>
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                                        <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-green-600 bg-green-50 rounded-lg sm:rounded-xl py-2 sm:py-3">
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="font-medium">Free shipping</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-blue-600 bg-blue-50 rounded-lg sm:rounded-xl py-2 sm:py-3">
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="font-medium">Secure checkout</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                            {cartItems.map(([productId, item]) => (
                                <CartItem key={productId} productId={productId} item={item} />
                            ))}
                        </div>

                        {/* Enhanced Order Summary */}
                        <div className="lg:col-span-1 mt-6 lg:mt-0">
                            <div className="static lg:sticky lg:top-6">
                                <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 backdrop-blur-sm overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
                                    <CardContent className="p-4 sm:p-6 md:p-8 relative z-10">
                                    <div className="text-center mb-6 sm:mb-8">
                                        <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-2 sm:mb-3 shadow-lg">
                                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                            Order Summary
                                        </h2>
                                        <p className="text-gray-500 text-xs sm:text-sm mt-1">Review your order details</p>
                                    </div>
                                    
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 border border-gray-200 shadow-lg">
                                            <div className="flex justify-between items-center group">
                                                <div className="flex items-center space-x-1 sm:space-x-2">
                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                    </svg>
                                                    <span className="text-gray-700 font-medium text-sm sm:text-base">Subtotal ({itemCount} items)</span>
                                                </div>
                                                <span className="font-bold text-gray-900 text-base sm:text-lg">{formatPrice(total)}</span>
                                            </div>
                                            <div className="flex justify-between items-center group">
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                    <span className="text-gray-700 font-medium text-sm sm:text-base">Shipping</span>
                                                    <Badge className="bg-green-100 text-green-800 text-xs font-semibold px-1.5 py-0.5 sm:px-2 sm:py-1">Free</Badge>
                                                </div>
                                                <span className="text-green-600 font-bold text-sm sm:text-base">FREE</span>
                                            </div>
                                            <div className="flex justify-between items-center group">
                                                <div className="flex items-center space-x-1 sm:space-x-2">
                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-gray-700 font-medium text-sm sm:text-base">Tax</span>
                                                </div>
                                                <span className="text-gray-600 text-xs sm:text-sm font-medium">Calculated at checkout</span>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border border-blue-200">
                                            <div className="flex justify-between items-center mb-2 sm:mb-3">
                                                <div className="flex items-center space-x-1 sm:space-x-2">
                                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-lg sm:text-xl font-bold text-white">Total</span>
                                                </div>
                                                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{formatPrice(total)}</span>
                                            </div>
                                            <p className="text-blue-100 text-xs sm:text-sm">Including all taxes and fees</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                                        {auth?.user ? (
                                            <Button asChild size="lg" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0">
                                                <Link href={route('checkout.index')} className="flex items-center justify-center gap-2 sm:gap-3">
                                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    Proceed to Checkout
                                                </Link>
                                            </Button>
                                        ) : (
                                            <div className="space-y-3 sm:space-y-4">
                                                <Button 
                                                    onClick={() => setIsLoginModalOpen(true)}
                                                    size="lg" 
                                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3"
                                                >
                                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                    </svg>
                                                    Sign In to Checkout
                                                </Button>
                                                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl">
                                                    <p className="text-xs sm:text-sm text-gray-600 mb-2">New customer?</p>
                                                    <button 
                                                        onClick={() => setIsRegisterModalOpen(true)}
                                                        className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-colors cursor-pointer text-sm sm:text-base md:text-lg"
                                                    >
                                                        Create an account →
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <Button asChild variant="outline" size="lg" className="w-full border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 py-2.5 sm:py-3 text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl transition-all duration-300">
                                            <Link href="/" className="flex items-center justify-center gap-2 sm:gap-3">
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                                </svg>
                                                Continue Shopping
                                            </Link>
                                        </Button>
                                        
                                        {/* Trust Badges */}
                                        <div className="pt-4 sm:pt-6 border-t border-gray-200">
                                            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                                <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg sm:rounded-xl border border-green-100">
                                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                    </svg>
                                                    <span className="text-xs font-semibold text-green-700">SSL Secure</span>
                                                </div>
                                                <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-100">
                                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                    <span className="text-xs font-semibold text-blue-700">Free Ship</span>
                                                </div>
                                                <div className="text-center p-2 sm:p-3 bg-purple-50 rounded-lg sm:rounded-xl border border-purple-100">
                                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                    <span className="text-xs font-semibold text-purple-700">30-Day Return</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enhanced Security & Trust Section */}
                {cartItems.length > 0 && (
                    <div className="mt-8 sm:mt-12 md:mt-16 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-gray-200 shadow-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 opacity-50"></div>
                        <div className="relative z-10">
                            <div className="text-center mb-6 sm:mb-8">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Why Shop With Us?</h3>
                                <p className="text-sm sm:text-base text-gray-600 px-2">Your security and satisfaction are our top priorities</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                                <div className="text-center p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Secure Checkout</h4>
                                    <p className="text-sm sm:text-base text-gray-600">256-bit SSL encrypted payment processing for maximum security</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Free Shipping</h4>
                                    <p className="text-sm sm:text-base text-gray-600">Fast and free delivery on all orders, no minimum purchase required</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                        </svg>
                                    </div>
                                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Easy Returns</h4>
                                    <p className="text-sm sm:text-base text-gray-600">Hassle-free 30-day return policy with no questions asked</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Authentication Modals */}
            <AuthModals
                isLoginOpen={isLoginModalOpen}
                isRegisterOpen={isRegisterModalOpen}
                onClose={handleCloseModal}
                onSwitchToLogin={handleSwitchToLogin}
                onSwitchToRegister={handleSwitchToRegister}
            />
        </PublicLayout>
    );
}
