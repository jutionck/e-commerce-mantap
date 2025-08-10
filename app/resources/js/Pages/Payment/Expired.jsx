import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';

export default function PaymentExpired({ order, expiredAt }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDateTime = (dateTime) => {
        return new Date(dateTime).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Payment Expired - Order ${order.order_number}`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Pembayaran Expired
                        </h1>
                        <p className="text-lg text-gray-600">
                            Waktu pembayaran untuk pesanan #{order.order_number} telah berakhir
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Expiry Information */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                        Waktu Habis
                                    </h2>
                                    <p className="text-gray-600 mb-4">
                                        Pembayaran berakhir pada:
                                    </p>
                                    <p className="text-lg font-medium text-red-600 bg-red-50 rounded-lg px-4 py-2">
                                        {formatDateTime(expiredAt)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Summary */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Ringkasan Pesanan
                                </h2>
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
                    </div>

                    {/* What happens next */}
                    <Card className="mt-6">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Apa yang Terjadi Selanjutnya?
                            </h2>
                            <div className="prose max-w-none text-gray-700">
                                <ul className="space-y-3">
                                    <li className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                                            <span className="text-xs font-medium text-blue-600">1</span>
                                        </div>
                                        <div>
                                            <strong>Pesanan Dibatalkan:</strong> Pesanan Anda telah otomatis dibatalkan karena tidak ada pembayaran dalam waktu yang ditentukan.
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                                            <span className="text-xs font-medium text-blue-600">2</span>
                                        </div>
                                        <div>
                                            <strong>Stok Dikembalikan:</strong> Produk yang ada di pesanan ini telah dikembalikan ke stok dan tersedia untuk pelanggan lain.
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                                            <span className="text-xs font-medium text-blue-600">3</span>
                                        </div>
                                        <div>
                                            <strong>Buat Pesanan Baru:</strong> Anda dapat membuat pesanan baru dengan produk yang sama atau berbeda.
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700">
                            <Link href="/">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                Belanja Lagi
                            </Link>
                        </Button>
                        
                        <Button asChild variant="outline">
                            <Link href={route('orders.index')}>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                                Lihat Pesanan Lain
                            </Link>
                        </Button>

                        <Button asChild variant="ghost">
                            <Link href={route('orders.show', order.id)}>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Detail Pesanan
                            </Link>
                        </Button>
                    </div>

                    {/* Help Section */}
                    <Card className="mt-8 bg-blue-50 border-blue-200">
                        <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-blue-900 mb-2">
                                        Butuh Bantuan?
                                    </h3>
                                    <p className="text-blue-700 mb-3">
                                        Jika Anda mengalami masalah atau memiliki pertanyaan tentang proses pembayaran, 
                                        tim customer service kami siap membantu Anda.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-2 text-sm">
                                        <span className="flex items-center text-blue-700">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            support@example.com
                                        </span>
                                        <span className="flex items-center text-blue-700">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            +62 21 1234 5678
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}