import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PaymentMethodSelector from '@/Components/Payment/PaymentMethodSelector';
import PaymentInstructions from '@/Components/Payment/PaymentInstructions';
import PaymentCountdown from '@/Components/Payment/PaymentCountdown';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

export default function PaymentIndex({ order, availablePaymentMethods }) {
    const [currentStep, setCurrentStep] = useState('select'); // select, processing, instructions
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPaymentType, setSelectedPaymentType] = useState(null);
    const [selectedPaymentOptions, setSelectedPaymentOptions] = useState({});
    const [paymentData, setPaymentData] = useState(null);
    const [error, setError] = useState(null);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handlePaymentMethodSelect = (paymentType, options) => {
        setSelectedPaymentType(paymentType);
        setSelectedPaymentOptions(options);
        setError(null);
    };

    const handleCoreApiPayment = () => {
        if (!selectedPaymentType) {
            setError('Pilih metode pembayaran terlebih dahulu');
            return;
        }

        // Check CSRF token exists
        const csrfToken = document.querySelector('meta[name="csrf-token"]');
        if (!csrfToken) {
            setError('CSRF token tidak ditemukan. Silakan refresh halaman.');
            return;
        }

        setCurrentStep('processing');
        setIsLoading(true);
        setError(null);

        fetch(`/payments/${order.id}/core-api`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            },
            body: JSON.stringify({
                payment_type: selectedPaymentType,
                payment_options: selectedPaymentOptions,
            }),
        })
        .then(response => {
            // Log response for debugging
            console.log('Payment response status:', response.status);
            console.log('Payment response headers:', response.headers);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                // If response is not JSON, get text instead
                return response.text().then(text => {
                    console.error('Non-JSON response received:', text);
                    throw new Error('Server returned non-JSON response');
                });
            }
            
            return response.json();
        })
        .then(data => {
            if (data.success) {
                setPaymentData(data.data);
                setCurrentStep('instructions');
                
                // Start checking payment status
                startPaymentStatusCheck();
            } else {
                throw new Error(data.error || 'Failed to create payment');
            }
        })
        .catch(error => {
            console.error('Core API payment error:', error);
            setError(error.message);
            setCurrentStep('select');
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    const startPaymentStatusCheck = () => {
        const checkStatus = () => {
            fetch(`/payments/${order.id}/check-status`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const contentType = response.headers.get('content-type');
                    if (!contentType || !contentType.includes('application/json')) {
                        return response.text().then(text => {
                            console.error('Non-JSON status response:', text);
                            throw new Error('Server returned non-JSON response');
                        });
                    }
                    
                    return response.json();
                })
                .then(data => {
                    console.log('Payment status check:', data);
                    
                    // Handle expired payment
                    if (data.status === 'expired') {
                        if (data.redirect) {
                            window.location.href = data.redirect;
                        } else {
                            router.visit(route('payments.expired', order.id));
                        }
                        return;
                    }
                    
                    if (data.payment_status && data.payment_status.transaction_status === 'settlement') {
                        window.location.href = `/orders/${order.id}?payment=success`;
                    } else if (data.payment_status && ['failed', 'expire', 'deny', 'cancel'].includes(data.payment_status.transaction_status)) {
                        setError('Pembayaran gagal atau expired');
                        setCurrentStep('select');
                    }
                })
                .catch(error => {
                    console.error('Status check error:', error);
                });
        };

        // Check every 5 seconds
        const interval = setInterval(checkStatus, 5000);
        
        // Stop checking after 10 minutes
        setTimeout(() => {
            clearInterval(interval);
        }, 600000);
        
        // Return cleanup function
        return () => clearInterval(interval);
    };

    const handlePaymentExpiry = () => {
        // Redirect to expired page when payment expires
        router.visit(route('payments.expired', order.id));
    };

    const renderOrderSummary = () => (
        <Card className="mb-6">
            <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span>Order Number:</span>
                        <span className="font-medium">{order.order_number}</span>
                    </div>
                    <div className="space-y-2">
                        {order.order_items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.product.name} x {item.quantity}</span>
                                <span>{formatPrice(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Shipping ({order.shipping_method}):</span>
                        <span>{formatPrice(order.shipping_cost)}</span>
                    </div>
                    <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold">
                            <span>Total:</span>
                            <span className="text-lg">{formatPrice(order.total_amount)}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const renderPaymentOptions = () => (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-start space-x-4 mb-6">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">Pilih Metode Pembayaran</h3>
                        <p className="text-gray-600 mb-4">
                            Pilih metode pembayaran yang Anda inginkan dan ikuti instruksi yang diberikan
                        </p>
                        <div className="flex space-x-2 mb-4">
                            <Badge variant="secondary">Virtual Account</Badge>
                            <Badge variant="secondary">QRIS</Badge>
                            <Badge variant="secondary">Instan</Badge>
                            <Badge variant="secondary">Aman</Badge>
                        </div>
                    </div>
                </div>

                <PaymentMethodSelector
                    availablePaymentMethods={availablePaymentMethods}
                    onSelect={handlePaymentMethodSelect}
                />

                {selectedPaymentType && (
                    <div className="mt-6 pt-4 border-t">
                        <Button
                            onClick={handleCoreApiPayment}
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg font-medium"
                        >
                            {isLoading && currentStep === 'processing' ? 'Memproses Pembayaran...' : 'Lanjutkan Pembayaran'}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    const renderPaymentInstructions = () => (
        <div className="space-y-6">
            <PaymentInstructions paymentData={paymentData} />
            
            <Card>
                <CardContent className="p-4">
                    <Button
                        onClick={() => {
                            setCurrentStep('select');
                            setPaymentData(null);
                            setSelectedPaymentType(null);
                            setSelectedPaymentOptions({});
                        }}
                        variant="outline"
                        className="w-full"
                    >
                        Kembali ke Pilihan Pembayaran
                    </Button>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <AuthenticatedLayout>
            <Head title={`Payment - Order ${order.order_number}`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Pembayaran Order #{order.order_number}
                        </h1>
                        <p className="text-gray-600">
                            Pilih metode pembayaran untuk menyelesaikan pesanan Anda
                        </p>
                    </div>

                    {/* Payment Countdown Timer */}
                    <PaymentCountdown 
                        order={order} 
                        onExpiry={handlePaymentExpiry}
                    />

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.865-.833-2.635 0L4.179 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                <span className="text-red-700 font-medium">{error}</span>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Order Summary - Left Column */}
                        <div className="lg:col-span-1">
                            {renderOrderSummary()}
                        </div>

                        {/* Payment Content - Right Column */}
                        <div className="lg:col-span-2">
                            {currentStep === 'select' && renderPaymentOptions()}
                            {currentStep === 'instructions' && renderPaymentInstructions()}
                            {currentStep === 'processing' && (
                                <Card>
                                    <CardContent className="p-8 text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Memproses Pembayaran</h3>
                                        <p className="text-gray-600">
                                            Sedang membuat instruksi pembayaran untuk Anda...
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}