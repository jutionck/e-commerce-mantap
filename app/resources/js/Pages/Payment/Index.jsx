import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

export default function PaymentIndex({ order, paymentData, snapUrl }) {
    const [isLoading, setIsLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('pending');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handlePayment = () => {
        setIsLoading(true);
        
        // Load Snap script if not already loaded
        if (!window.snap) {
            const script = document.createElement('script');
            script.src = snapUrl;
            script.setAttribute('data-client-key', paymentData.client_key);
            script.onload = () => initializePayment();
            document.head.appendChild(script);
        } else {
            initializePayment();
        }
    };

    const initializePayment = () => {
        window.snap.pay(paymentData.snap_token, {
            onSuccess: function(result) {
                setPaymentStatus('success');
                window.location.href = `/payments/success?order_id=${order.order_number}`;
            },
            onPending: function(result) {
                setPaymentStatus('pending');
                window.location.href = `/payments/pending?order_id=${order.order_number}`;
            },
            onError: function(result) {
                setPaymentStatus('error');
                setIsLoading(false);
                alert('Pembayaran gagal. Silakan coba lagi.');
            },
            onClose: function() {
                setIsLoading(false);
            }
        });
    };

    const checkPaymentStatus = async () => {
        try {
            const response = await fetch(`/payments/${order.id}/check-status`);
            const data = await response.json();
            
            if (data.status === 'success') {
                setPaymentStatus(data.order_status);
                
                if (data.order_status === 'paid') {
                    window.location.href = `/orders/${order.id}`;
                }
            }
        } catch (error) {
            // Silent error handling for background status checks
        }
    };

    // Check payment status periodically
    useEffect(() => {
        const interval = setInterval(checkPaymentStatus, 10000); // Check every 10 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <AuthenticatedLayout>
            <Head title={`Payment - Order #${order.order_number}`} />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="absolute top-0 left-0 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
                            Complete Your Payment
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Order #{order.order_number} • {formatPrice(order.total_amount)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-4 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div>
                        <Card className="shadow-xl border-0 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Order Summary
                                    </h3>
                                </div>
                                <CardContent className="p-6 bg-white">
                                    <div className="space-y-4">
                                        {order.order_items && order.order_items.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900">{item.product.name}</p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {formatPrice(item.price)} × {item.quantity} unit{item.quantity > 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                                <p className="font-bold text-lg text-blue-600">{formatPrice(item.total)}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="my-6 border-t border-gray-200 pt-4">
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-gray-600">
                                                <span>Subtotal</span>
                                                <span className="font-medium">{formatPrice(order.total_amount - order.shipping_cost)}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                    Shipping ({order.shipping_method})
                                                </span>
                                                <span className="font-medium">{formatPrice(order.shipping_cost)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 text-white shadow-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold">Total Amount</span>
                                            <span className="text-2xl font-bold">{formatPrice(order.total_amount)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Shipping Information */}
                            <Card className="mt-6 shadow-xl border-0 overflow-hidden">
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Shipping Information
                                    </h3>
                                </div>
                                <CardContent className="p-6 bg-white">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-4">
                                            <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                                                <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
                                                    <p className="font-semibold text-gray-900">{order.shipping_address?.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                                                <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                                                    <p className="font-semibold text-gray-900">{order.shipping_address?.phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-start p-3 bg-gray-50 rounded-xl">
                                                <svg className="w-5 h-5 text-gray-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                                                    <p className="font-semibold text-gray-900">{order.shipping_address?.address}</p>
                                                    <p className="text-sm text-gray-600 mt-1">{order.shipping_address?.city} {order.shipping_address?.postal_code}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                    {/* Payment Section */}
                    <div>
                        <Card className="shadow-xl border-0 overflow-hidden">
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        Payment Details
                                    </h3>
                                </div>
                                <CardContent className="p-6 bg-white">
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                                            <svg className="w-5 h-5 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Order Status</p>
                                                <Badge variant={order.status === 'pending_payment' ? 'secondary' : 'default'} className="mt-1">
                                                    {order.status.replace('_', ' ').toUpperCase()}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                                            <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Status</p>
                                                <Badge variant={paymentStatus === 'success' ? 'default' : 'secondary'} className="mt-1">
                                                    {paymentStatus.toUpperCase()}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 mb-6">
                                        <div className="flex items-start">
                                            <svg className="w-6 h-6 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div>
                                                <p className="font-bold text-blue-900 mb-3">Payment Methods Available:</p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-sm text-blue-700 font-medium">Credit/Debit Card</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-sm text-blue-700 font-medium">Bank Transfer</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-sm text-blue-700 font-medium">E-Wallet</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-sm text-blue-700 font-medium">QRIS</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Button
                                            onClick={handlePayment}
                                            disabled={isLoading || paymentStatus === 'success'}
                                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing Payment...
                                                </div>
                                            ) : paymentStatus === 'success' ? (
                                                <div className="flex items-center justify-center">
                                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Payment Completed
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center">
                                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                    Pay Securely Now
                                                </div>
                                            )}
                                        </Button>

                                        <div className="text-center pt-4 border-t border-gray-200">
                                            <p className="text-sm text-gray-600 mb-3">Secure payment powered by</p>
                                            <div className="flex items-center justify-center space-x-2">
                                                <img 
                                                    src="https://midtrans.com/assets/images/main/midtrans-logo.png" 
                                                    alt="Midtrans" 
                                                    className="h-8"
                                                />
                                                <div className="flex items-center space-x-1">
                                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                    </svg>
                                                    <span className="text-xs text-gray-500">SSL Secured</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Instructions */}
                            <Card className="mt-6 shadow-xl border-0 overflow-hidden">
                                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 border-b border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        How to Pay
                                    </h3>
                                </div>
                                <CardContent className="p-6 bg-white">
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">1</div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Start Payment</h4>
                                                <p className="text-sm text-gray-600">Click "Pay Securely Now" button to proceed with payment</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">2</div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Choose Payment Method</h4>
                                                <p className="text-sm text-gray-600">Select your preferred payment method from the available options</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">3</div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Complete Payment</h4>
                                                <p className="text-sm text-gray-600">Follow the instructions to complete your payment securely</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">4</div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Order Processed</h4>
                                                <p className="text-sm text-gray-600">Your order will be processed automatically after successful payment</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-sm text-green-800 font-medium">
                                                Payment status will be updated automatically. You'll receive confirmation via email.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}