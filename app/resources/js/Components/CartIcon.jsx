import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function CartIcon({ cart = {}, className = "" }) {
    const [isOpen, setIsOpen] = useState(false);
    const { delete: destroy, processing } = useForm();

    const cartItems = Object.entries(cart);
    const itemCount = cartItems.reduce((total, [, item]) => total + parseInt(item.quantity), 0);
    const cartTotal = cartItems.reduce((total, [, item]) => total + (item.price * item.quantity), 0);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const handleRemoveItem = (productId) => {
        destroy(route('cart.destroy', productId), {
            preserveState: true,
            onSuccess: () => {
                // Cart will be updated automatically
            }
        });
    };

    return (
        <div className={`relative ${className}`}>
            {/* Cart Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition duration-150 ease-in-out"
            >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H2m5 8v6a2 2 0 002 2h6a2 2 0 002-2v-6M9 21h6"
                    />
                </svg>
                
                {/* Item Count Badge */}
                {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full min-w-[20px] h-5">
                        {itemCount > 99 ? '99+' : itemCount}
                    </span>
                )}
            </button>

            {/* Cart Dropdown */}
            <Transition
                show={isOpen}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <div className="absolute right-0 z-50 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Shopping Cart</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {cartItems.length === 0 ? (
                            <div className="text-center py-8">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H2m5 8v6a2 2 0 002 2h6a2 2 0 002-2v-6M9 21h6" />
                                </svg>
                                <p className="mt-2 text-sm text-gray-500">Your cart is empty</p>
                                <Link
                                    href="/"
                                    className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        ) : (
                            <>
                                {/* Cart Items */}
                                <div className="max-h-64 overflow-y-auto space-y-3">
                                    {cartItems.map(([productId, item]) => (
                                        <div key={productId} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition duration-150">
                                            <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                                                <img 
                                                    src={item.image || "/images/product_placeholder.png"}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {item.name}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm text-gray-500">
                                                        Qty: {item.quantity}
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <button
                                                onClick={() => handleRemoveItem(productId)}
                                                disabled={processing}
                                                className="flex-shrink-0 text-gray-400 hover:text-red-500 transition duration-150 disabled:opacity-50"
                                            >
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Cart Footer */}
                                <div className="border-t border-gray-200 pt-4 mt-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-base font-medium text-gray-900">Total:</span>
                                        <span className="text-lg font-bold text-gray-900">
                                            {formatPrice(cartTotal)}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Link
                                            href={route('cart.index')}
                                            className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            View Cart
                                        </Link>
                                        <Link
                                            href={route('checkout.index')}
                                            className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Checkout
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Transition>

            {/* Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}