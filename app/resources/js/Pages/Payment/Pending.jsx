import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

export default function PaymentPending({ order }) {
    const [isChecking, setIsChecking] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const checkPaymentStatus = async () => {
        setIsChecking(true);
        try {
            const response = await fetch(`/payments/${order.id}/check-status`);
            const data = await response.json();
            
            if (data.status === 'success' && data.order_status === 'paid') {
                window.location.href = `/payments/success?order_id=${order.order_number}`;
            } else if (data.status === 'error') {
                console.log('Payment not found yet, will check again later');
                setTimeout(() => setIsChecking(false), 1000);
            } else {
                setTimeout(() => setIsChecking(false), 1000);
            }
        } catch (error) {
            console.error('Error checking payment status:', error);
            setIsChecking(false);
        }
    };

    // Calculate time left for payment (24 hours from order creation)
    useEffect(() => {
        const calculateTimeLeft = () => {
            const orderTime = new Date(order.created_at);
            const expiryTime = new Date(orderTime.getTime() + 24 * 60 * 60 * 1000); // 24 hours
            const now = new Date();
            const difference = expiryTime - now;

            if (difference > 0) {
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                setTimeLeft({
                    hours: hours.toString().padStart(2, '0'),
                    minutes: minutes.toString().padStart(2, '0'),
                    seconds: seconds.toString().padStart(2, '0'),
                    total: difference
                });
            } else {
                setTimeLeft(null);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [order.created_at]);

    // Auto-check payment status every 2 minutes (further reduced to minimize API calls)
    useEffect(() => {
        // Only start auto-check after 1 minute delay to allow user to complete payment
        const initialDelay = setTimeout(() => {
            const interval = setInterval(() => {
                if (!isChecking) {
                    checkPaymentStatus();
                }
            }, 120000); // Changed to 2 minutes

            return () => clearInterval(interval);
        }, 60000); // 1 minute initial delay

        return () => clearTimeout(initialDelay);
    }, [isChecking]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
            <Head title="Payment Pending" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Pending Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
                            <svg className="w-12 h-12 text-yellow-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Pending</h1>
                        <p className="text-lg text-gray-600">Your payment is being processed. Please wait for confirmation.</p>
                    </div>

                    {/* Payment Timer */}
                    {timeLeft && timeLeft.total > 0 && (
                        <Card className="mb-8">
                            <CardContent className="p-6 text-center">
                                <h3 className="text-lg font-semibold mb-4">Payment Time Remaining</h3>
                                <div className="flex justify-center space-x-4 mb-4">
                                    <div className="bg-yellow-100 rounded-lg p-3 min-w-[60px]">
                                        <div className="text-2xl font-bold text-yellow-800">{timeLeft.hours}</div>
                                        <div className="text-xs text-yellow-600">HOURS</div>
                                    </div>
                                    <div className="bg-yellow-100 rounded-lg p-3 min-w-[60px]">
                                        <div className="text-2xl font-bold text-yellow-800">{timeLeft.minutes}</div>
                                        <div className="text-xs text-yellow-600">MINUTES</div>
                                    </div>
                                    <div className="bg-yellow-100 rounded-lg p-3 min-w-[60px]">
                                        <div className="text-2xl font-bold text-yellow-800">{timeLeft.seconds}</div>
                                        <div className="text-xs text-yellow-600">SECONDS</div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Complete your payment before the time expires
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Order Details */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Order Details
                                </h3>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Order Number:</span>
                                        <span className="font-semibold">{order.order_number}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Order Status:</span>
                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                            PENDING PAYMENT
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Amount:</span>
                                        <span className="font-bold text-lg">{formatPrice(order.total_amount)}</span>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-3">Items Ordered:</h4>
                                    <div className="space-y-3">
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
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Status & Actions */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Payment Status
                                </h3>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div className="text-sm">
                                            <p className="font-medium text-yellow-900 mb-1">Payment is being processed</p>
                                            <p className="text-yellow-700">
                                                This may take a few minutes. Please do not close this page or refresh your browser.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <Button
                                        onClick={checkPaymentStatus}
                                        disabled={isChecking}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        {isChecking ? (
                                            <div className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Checking...
                                            </div>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Check Payment Status
                                            </>
                                        )}
                                    </Button>

                                    <Link href={`/payments/${order.id}`}>
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Retry Payment
                                        </Button>
                                    </Link>
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-3">What to expect:</h4>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-start">
                                            <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium mr-3 mt-0.5">1</span>
                                            <p>Payment confirmation may take up to 10 minutes</p>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium mr-3 mt-0.5">2</span>
                                            <p>You'll receive an email once payment is confirmed</p>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium mr-3 mt-0.5">3</span>
                                            <p>Your order will automatically proceed to processing</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/orders">
                            <Button variant="outline" className="px-8 py-3">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View All Orders
                            </Button>
                        </Link>
                        
                        <Link href="/">
                            <Button variant="outline" className="px-8 py-3">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}