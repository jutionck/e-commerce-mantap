import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function OrderShow({ order, paymentExpiry }) {
    const [isChecking, setIsChecking] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(order);
    const [timeRemaining, setTimeRemaining] = useState(paymentExpiry?.time_remaining_minutes || 0);
    const [isExpired, setIsExpired] = useState(paymentExpiry?.is_expired || false);
    const getStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'confirmed': 'bg-blue-100 text-blue-800',
            'processing': 'bg-purple-100 text-purple-800',
            'shipped': 'bg-indigo-100 text-indigo-800',
            'delivered': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(price);
    };

    // Countdown timer for payment expiry
    useEffect(() => {
        if (isExpired || currentOrder.status === 'paid' || timeRemaining <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    setIsExpired(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [isExpired, currentOrder.status, timeRemaining]);

    // Format time remaining
    const formatTimeRemaining = (minutes) => {
        if (minutes <= 0) return 'Expired';
        
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        if (hours > 0) {
            return `${hours} jam ${mins} menit`;
        }
        return `${mins} menit`;
    };

    const checkPaymentStatus = async () => {
        setIsChecking(true);
        try {
            const response = await fetch(`/payments/${currentOrder.id}/check-status`);
            const data = await response.json();
            
            if (data.status === 'success') {
                // Update current order with new status
                setCurrentOrder(prev => ({
                    ...prev,
                    status: data.order_status
                }));
                
                if (data.order_status === 'paid') {
                    alert('Payment berhasil! Status pesanan telah diupdate.');
                    // Optional: reload page to get fresh data
                    window.location.reload();
                } else {
                    alert('Status payment: ' + (data.payment_status?.transaction_status || 'pending'));
                }
            } else {
                alert('Gagal mengecek status payment');
            }
        } catch (error) {
            alert('Gagal mengecek status pembayaran. Coba lagi.');
        } finally {
            setIsChecking(false);
        }
    };

    const subtotal = order.order_items.reduce((sum, item) => sum + parseFloat(item.total), 0);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Detail Pesanan
                    </h2>
                    <Link
                        href="/orders"
                        className="text-blue-600 hover:text-blue-800"
                    >
                        ← Kembali ke Daftar Pesanan
                    </Link>
                </div>
            }
        >
            <Head title={`Pesanan ${order.order_number}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Order Header */}
                            <div className="border-b pb-6 mb-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-2xl font-bold mb-2">{order.order_number}</h1>
                                        <p className="text-gray-600">
                                            Dipesan pada {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(currentOrder.status)}`}>
                                        {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Order Items */}
                                <div>
                                    <h2 className="text-lg font-semibold mb-4">Produk yang Dipesan</h2>
                                    <div className="space-y-4">
                                        {order.order_items.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg">
                                                <div className="flex-1">
                                                    <h3 className="font-medium">{item.product.name}</h3>
                                                    <p className="text-sm text-gray-600">
                                                        {formatPrice(item.price)} × {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="font-semibold">
                                                    {formatPrice(item.total)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Summary */}
                                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span>Subtotal:</span>
                                                <span>{formatPrice(subtotal)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Ongkos Kirim ({order.shipping_method}):</span>
                                                <span>{formatPrice(order.shipping_cost)}</span>
                                            </div>
                                            <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                                                <span>Total:</span>
                                                <span>{formatPrice(order.total_amount)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping & Payment Info */}
                                <div className="space-y-6">
                                    {/* Shipping Address */}
                                    <div>
                                        <h2 className="text-lg font-semibold mb-4">Alamat Pengiriman</h2>
                                        <div className="p-4 border rounded-lg bg-gray-50">
                                            <p className="font-medium">{order.shipping_address.name}</p>
                                            <p className="text-sm text-gray-600">{order.shipping_address.phone}</p>
                                            <p className="mt-2">{order.shipping_address.address}</p>
                                            <p>{order.shipping_address.city} {order.shipping_address.postal_code}</p>
                                        </div>
                                    </div>

                                    {/* Payment Status */}
                                    <div>
                                        <h2 className="text-lg font-semibold mb-4">Status Pembayaran</h2>
                                        <div className="p-4 border rounded-lg">
                                            {currentOrder.payment ? (
                                                <div>
                                                    {currentOrder.payment.status === 'paid' ? (
                                                        <div>
                                                            <p className="font-medium">
                                                                Status: 
                                                                <span className="ml-2 px-2 py-1 rounded text-sm bg-green-100 text-green-800">
                                                                    Lunas
                                                                </span>
                                                            </p>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                Metode: {currentOrder.payment.payment_method}
                                                            </p>
                                                            {currentOrder.payment.transaction_id && (
                                                                <p className="text-sm text-gray-600">
                                                                    ID Transaksi: {currentOrder.payment.transaction_id}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ) : isExpired ? (
                                                        <div>
                                                            <p className="text-red-600 font-medium mb-2">
                                                                ⏰ Waktu Pembayaran Telah Berakhir
                                                            </p>
                                                            <p className="text-sm text-gray-600 mb-3">
                                                                Batas waktu pembayaran untuk pesanan ini telah habis. 
                                                                Silakan buat pesanan baru untuk melanjutkan.
                                                            </p>
                                                            <button
                                                                disabled
                                                                className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
                                                            >
                                                                Pembayaran Expired
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <p className="font-medium">
                                                                Status: 
                                                                <span className="ml-2 px-2 py-1 rounded text-sm bg-yellow-100 text-yellow-800">
                                                                    Menunggu Pembayaran
                                                                </span>
                                                            </p>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                Metode: {currentOrder.payment.payment_method}
                                                            </p>
                                                            {currentOrder.payment.transaction_id && (
                                                                <p className="text-sm text-gray-600">
                                                                    ID Transaksi: {currentOrder.payment.transaction_id}
                                                                </p>
                                                            )}
                                                            
                                                            {timeRemaining > 0 && (
                                                                <div className="mt-2 mb-3">
                                                                    <div className="flex items-center text-sm text-gray-600">
                                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                        Sisa waktu: {formatTimeRemaining(timeRemaining)}
                                                                    </div>
                                                                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                                                                        <div 
                                                                            className={`h-2 rounded-full transition-all duration-1000 ${
                                                                                timeRemaining > 60 ? 'bg-green-500' : 
                                                                                timeRemaining > 30 ? 'bg-yellow-500' : 'bg-red-500'
                                                                            }`}
                                                                            style={{
                                                                                width: `${Math.max(0, (timeRemaining / (paymentExpiry?.time_remaining_minutes || 1440)) * 100)}%`
                                                                            }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            
                                                            <div className="mt-3 space-y-2">
                                                                <Link 
                                                                    href={`/payments/${currentOrder.id}`}
                                                                    className={`inline-block px-4 py-2 text-white rounded transition ${
                                                                        timeRemaining <= 30 && timeRemaining > 0 
                                                                            ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                                                                            : 'bg-blue-600 hover:bg-blue-700'
                                                                    }`}
                                                                >
                                                                    {timeRemaining <= 30 && timeRemaining > 0 ? '⚡ Bayar Segera' : 'Bayar Sekarang'}
                                                                </Link>
                                                                
                                                                <button
                                                                    onClick={checkPaymentStatus}
                                                                    disabled={isChecking}
                                                                    className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center"
                                                                >
                                                                    {isChecking ? (
                                                                        <>
                                                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                            </svg>
                                                                            Mengecek...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                                            </svg>
                                                                            Cek Status Pembayaran
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div>
                                                    {isExpired ? (
                                                        <div>
                                                            <p className="text-red-600 font-medium mb-2">
                                                                ⏰ Waktu Pembayaran Telah Berakhir
                                                            </p>
                                                            <p className="text-sm text-gray-600 mb-3">
                                                                Batas waktu pembayaran untuk pesanan ini telah habis. 
                                                                Silakan buat pesanan baru untuk melanjutkan.
                                                            </p>
                                                            <button
                                                                disabled
                                                                className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
                                                            >
                                                                Pembayaran Expired
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <p className="text-yellow-600 font-medium">Menunggu Pembayaran</p>
                                                            {timeRemaining > 0 && (
                                                                <div className="mt-2 mb-3">
                                                                    <div className="flex items-center text-sm text-gray-600">
                                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                        Sisa waktu: {formatTimeRemaining(timeRemaining)}
                                                                    </div>
                                                                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                                                                        <div 
                                                                            className={`h-2 rounded-full transition-all duration-1000 ${
                                                                                timeRemaining > 60 ? 'bg-green-500' : 
                                                                                timeRemaining > 30 ? 'bg-yellow-500' : 'bg-red-500'
                                                                            }`}
                                                                            style={{
                                                                                width: `${Math.max(0, (timeRemaining / (paymentExpiry?.time_remaining_minutes || 1440)) * 100)}%`
                                                                            }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <Link 
                                                                href={`/payments/${currentOrder.id}`}
                                                                className={`mt-2 inline-block px-4 py-2 text-white rounded transition ${
                                                                    timeRemaining <= 30 && timeRemaining > 0 
                                                                        ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                                                                        : 'bg-blue-600 hover:bg-blue-700'
                                                                }`}
                                                            >
                                                                {timeRemaining <= 30 && timeRemaining > 0 ? '⚡ Bayar Segera' : 'Bayar Sekarang'}
                                                            </Link>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Order Timeline */}
                                    <div>
                                        <h2 className="text-lg font-semibold mb-4">Timeline Pesanan</h2>
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                <div>
                                                    <p className="font-medium">Pesanan Dibuat</p>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(order.created_at).toLocaleDateString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                            {currentOrder.status !== 'pending' && (
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                    <div>
                                                        <p className="font-medium">Status: {currentOrder.status}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}