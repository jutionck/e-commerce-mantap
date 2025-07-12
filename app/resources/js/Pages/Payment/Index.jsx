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
                console.log('Payment success:', result);
                setPaymentStatus('success');
                // Redirect handled by Midtrans
                window.location.href = `/payments/success?order_id=${order.order_number}`;
            },
            onPending: function(result) {
                console.log('Payment pending:', result);
                setPaymentStatus('pending');
                window.location.href = `/payments/pending?order_id=${order.order_number}`;
            },
            onError: function(result) {
                console.log('Payment error:', result);
                setPaymentStatus('error');
                setIsLoading(false);
                alert('Payment failed. Please try again.');
            },
            onClose: function() {
                console.log('Payment popup closed');
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
            console.error('Error checking payment status:', error);
        }
    };

    // Check payment status periodically
    useEffect(() => {
        const interval = setInterval(checkPaymentStatus, 10000); // Check every 10 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Payment - Order #{order.order_number}
                </h2>
            }
        >
            <Head title={`Payment - Order #${order.order_number}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Order Summary */}
                        <div>
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                                    
                                    <div className="space-y-4">
                                        {order.order_items && order.order_items.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center">
                                                <div className="flex-1">
                                                    <p className="font-medium">{item.product.name}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {formatPrice(item.price)} × {item.quantity}
                                                    </p>
                                                </div>
                                                <p className="font-semibold">{formatPrice(item.total)}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <hr className="my-4" />

                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span>{formatPrice(order.total_amount - order.shipping_cost)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Shipping ({order.shipping_method})</span>
                                            <span>{formatPrice(order.shipping_cost)}</span>
                                        </div>
                                    </div>

                                    <hr className="my-4" />

                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>{formatPrice(order.total_amount)}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Shipping Information */}
                            <Card className="mt-6">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
                                    <div className="space-y-2 text-sm">
                                        <p><strong>Name:</strong> {order.shipping_address?.name}</p>
                                        <p><strong>Phone:</strong> {order.shipping_address?.phone}</p>
                                        <p><strong>Address:</strong> {order.shipping_address?.address}</p>
                                        <p><strong>City:</strong> {order.shipping_address?.city}</p>
                                        <p><strong>Postal Code:</strong> {order.shipping_address?.postal_code}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Payment Section */}
                        <div>
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Payment</h3>
                                    
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span>Order Status:</span>
                                            <Badge variant={order.status === 'pending_payment' ? 'secondary' : 'default'}>
                                                {order.status.replace('_', ' ').toUpperCase()}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Payment Status:</span>
                                            <Badge variant={paymentStatus === 'success' ? 'default' : 'secondary'}>
                                                {paymentStatus.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div className="text-sm">
                                                <p className="font-medium text-blue-900 mb-1">Payment Methods Available:</p>
                                                <ul className="text-blue-700 space-y-1">
                                                    <li>• Credit/Debit Card (Visa, Mastercard)</li>
                                                    <li>• Bank Transfer (BCA, BNI, BRI, Mandiri)</li>
                                                    <li>• E-Wallet (GoPay, ShopeePay)</li>
                                                    <li>• QRIS</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Button
                                            onClick={handlePayment}
                                            disabled={isLoading || paymentStatus === 'success'}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </div>
                                            ) : paymentStatus === 'success' ? (
                                                'Payment Completed'
                                            ) : (
                                                'Pay Now'
                                            )}
                                        </Button>

                                        <div className="text-center">
                                            <p className="text-sm text-gray-600 mb-2">Secure payment powered by</p>
                                            <div className="flex items-center justify-center">
                                                <img 
                                                    src="https://midtrans.com/assets/images/main/midtrans-logo.png" 
                                                    alt="Midtrans" 
                                                    className="h-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Instructions */}
                            <Card className="mt-6">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Payment Instructions</h3>
                                    <div className="space-y-3 text-sm text-gray-600">
                                        <div className="flex items-start">
                                            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium mr-3 mt-0.5">1</span>
                                            <p>Click "Pay Now" button to proceed with payment</p>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium mr-3 mt-0.5">2</span>
                                            <p>Choose your preferred payment method</p>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium mr-3 mt-0.5">3</span>
                                            <p>Complete the payment process</p>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium mr-3 mt-0.5">4</span>
                                            <p>Your order will be processed automatically</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}