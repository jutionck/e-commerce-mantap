import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function OrderShow({ order }) {
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
                                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
                                            {order.payment ? (
                                                <div>
                                                    <p className="font-medium">
                                                        Status: 
                                                        <span className={`ml-2 px-2 py-1 rounded text-sm ${
                                                            order.payment.status === 'paid' 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {order.payment.status === 'paid' ? 'Lunas' : 'Menunggu Pembayaran'}
                                                        </span>
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Metode: {order.payment.payment_method}
                                                    </p>
                                                    {order.payment.transaction_id && (
                                                        <p className="text-sm text-gray-600">
                                                            ID Transaksi: {order.payment.transaction_id}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="text-yellow-600 font-medium">Menunggu Pembayaran</p>
                                                    <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                                                        Bayar Sekarang
                                                    </button>
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
                                            {order.status !== 'pending' && (
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                    <div>
                                                        <p className="font-medium">Status: {order.status}</p>
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