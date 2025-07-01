import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function OrdersIndex({ orders }) {
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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Pesanan Saya
                </h2>
            }
        >
            <Head title="Pesanan Saya" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {orders.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">Belum ada pesanan</p>
                                    <Link
                                        href="/"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Mulai Belanja
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {orders.map((order) => (
                                        <div key={order.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold">
                                                        {order.order_number}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                {order.order_items.slice(0, 3).map((item) => (
                                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                                        <span>{item.product.name} × {item.quantity}</span>
                                                        <span>{formatPrice(item.total)}</span>
                                                    </div>
                                                ))}
                                                {order.order_items.length > 3 && (
                                                    <p className="text-sm text-gray-500">
                                                        +{order.order_items.length - 3} produk lainnya
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex justify-between items-center pt-4 border-t">
                                                <div>
                                                    <p className="text-lg font-semibold">
                                                        Total: {formatPrice(order.total_amount)}
                                                    </p>
                                                </div>
                                                <Link
                                                    href={`/orders/${order.id}`}
                                                    className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                >
                                                    Lihat Detail
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}