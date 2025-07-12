import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function Index({ cartItems, totalAmount }) {
    const [shippingOptions, setShippingOptions] = useState([]);
    const [selectedShipping, setSelectedShipping] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        shipping_address: {
            name: '',
            phone: '',
            address: '',
            city: '',
            postal_code: '',
        },
        shipping_method: '',
        shipping_cost: 0,
    });

    async function getShippingOptions() {
        if (!data.shipping_address.city.trim()) {
            alert('Mohon isi kota terlebih dahulu');
            return;
        }
        
        try {
            console.log('Fetching shipping options for:', data.shipping_address.city);
            const response = await axios.post('/shipping-cost', {
                destination: data.shipping_address.city,
            });
            console.log('Shipping options received:', response.data);
            setShippingOptions(response.data);
        } catch (error) {
            console.error('Error fetching shipping options:', error);
            alert('Gagal mengambil opsi pengiriman. Coba lagi.');
        }
    }

    function handleShippingSelect(option) {
        setSelectedShipping(option);
        setData({
            ...data,
            shipping_method: option.name,
            shipping_cost: option.cost,
        });
    }

    function submit(e) {
        e.preventDefault();
        console.log('Form submit triggered');
        console.log('Form data:', data);
        console.log('Selected shipping:', selectedShipping);
        
        post(route('checkout.store'), {
            onStart: () => console.log('Request started'),
            onSuccess: (response) => console.log('Success:', response),
            onError: (errors) => console.log('Errors:', errors),
            onFinish: () => console.log('Request finished')
        });
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(price);
    };

    const subtotal = totalAmount;
    const shippingCost = selectedShipping ? selectedShipping.cost : 0;
    const total = subtotal + shippingCost;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Checkout
                </h2>
            }
        >
            <Head title="Checkout" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h2 className="text-2xl font-semibold mb-4">Alamat Pengiriman</h2>
                                    
                                    {/* Debug info */}
                                    <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
                                        <p><strong>Cart Items:</strong> {cartItems.length} items</p>
                                        <p><strong>Total:</strong> {formatPrice(totalAmount)}</p>
                                        <p><strong>Shipping Options:</strong> {shippingOptions.length} options</p>
                                        <p><strong>Selected Shipping:</strong> {selectedShipping ? selectedShipping.name : 'None'}</p>
                                    </div>
                                    <form onSubmit={submit}>
                                        <div className="mb-4">
                                            <label htmlFor="name" className="block mb-1 font-medium">Nama Penerima</label>
                                            <input 
                                                type="text" 
                                                id="name" 
                                                value={data.shipping_address.name} 
                                                onChange={e => setData('shipping_address', {...data.shipping_address, name: e.target.value})} 
                                                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                                required
                                            />
                                            {errors['shipping_address.name'] && <p className="text-red-500 text-sm mt-1">{errors['shipping_address.name']}</p>}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="phone" className="block mb-1 font-medium">Nomor Telepon</label>
                                            <input 
                                                type="text" 
                                                id="phone" 
                                                value={data.shipping_address.phone} 
                                                onChange={e => setData('shipping_address', {...data.shipping_address, phone: e.target.value})} 
                                                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                                required
                                            />
                                            {errors['shipping_address.phone'] && <p className="text-red-500 text-sm mt-1">{errors['shipping_address.phone']}</p>}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="address" className="block mb-1 font-medium">Alamat Lengkap</label>
                                            <textarea 
                                                id="address" 
                                                value={data.shipping_address.address} 
                                                onChange={e => setData('shipping_address', {...data.shipping_address, address: e.target.value})} 
                                                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                                rows="3"
                                                required
                                            />
                                            {errors['shipping_address.address'] && <p className="text-red-500 text-sm mt-1">{errors['shipping_address.address']}</p>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label htmlFor="city" className="block mb-1 font-medium">Kota</label>
                                                <input 
                                                    type="text" 
                                                    id="city" 
                                                    value={data.shipping_address.city} 
                                                    onChange={e => setData('shipping_address', {...data.shipping_address, city: e.target.value})} 
                                                    className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                                    required
                                                />
                                                {errors['shipping_address.city'] && <p className="text-red-500 text-sm mt-1">{errors['shipping_address.city']}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="postal_code" className="block mb-1 font-medium">Kode Pos</label>
                                                <input 
                                                    type="text" 
                                                    id="postal_code" 
                                                    value={data.shipping_address.postal_code} 
                                                    onChange={e => setData('shipping_address', {...data.shipping_address, postal_code: e.target.value})} 
                                                    className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                                    required
                                                />
                                                {errors['shipping_address.postal_code'] && <p className="text-red-500 text-sm mt-1">{errors['shipping_address.postal_code']}</p>}
                                            </div>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={getShippingOptions} 
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                                            disabled={!data.shipping_address.city}
                                        >
                                            Cek Ongkos Kirim
                                        </button>
                                        
                                        {selectedShipping && (
                                            <button 
                                                type="submit" 
                                                className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg w-full hover:bg-green-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed" 
                                                disabled={!selectedShipping || processing}
                                            >
                                                {processing ? 'Memproses...' : 'Buat Pesanan'}
                                            </button>
                                        )}
                                    </form>

                                    {shippingOptions.length > 0 && (
                                        <div className="mt-8">
                                            <h2 className="text-xl font-semibold mb-4">Opsi Pengiriman</h2>
                                            <div className="space-y-2">
                                                {shippingOptions.map(option => (
                                                    <div key={option.name} className="border rounded-lg p-4 flex justify-between items-center">
                                                        <div>
                                                            <p className="font-semibold">{option.name}</p>
                                                            <p className="text-gray-500">{formatPrice(option.cost)}</p>
                                                        </div>
                                                        <button 
                                                            type="button"
                                                            onClick={() => handleShippingSelect(option)} 
                                                            className={`px-4 py-2 rounded-lg transition ${
                                                                selectedShipping && selectedShipping.name === option.name 
                                                                    ? 'bg-green-500 text-white' 
                                                                    : 'bg-gray-200 hover:bg-gray-300'
                                                            }`}
                                                        >
                                                            {selectedShipping && selectedShipping.name === option.name ? 'Terpilih' : 'Pilih'}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div>
                                    <h2 className="text-2xl font-semibold mb-4">Ringkasan Pesanan</h2>
                                    <div className="border rounded-lg p-6 bg-gray-50">
                                        <div className="space-y-3">
                                            {cartItems.map((item) => (
                                                <div key={item.product.id} className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-medium">{item.product.name}</p>
                                                        <p className="text-sm text-gray-600">{formatPrice(item.price)} × {item.quantity}</p>
                                                    </div>
                                                    <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <hr className="my-4" />
                                        
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <p>Subtotal</p>
                                                <p>{formatPrice(subtotal)}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p>Ongkos Kirim</p>
                                                <p>{formatPrice(shippingCost)}</p>
                                            </div>
                                        </div>
                                        
                                        <hr className="my-4" />
                                        
                                        <div className="flex justify-between font-bold text-xl">
                                            <p>Total</p>
                                            <p>{formatPrice(total)}</p>
                                        </div>
                                        
                                        {!selectedShipping && (
                                            <div className="mt-6 text-center text-gray-500 text-sm">
                                                Pilih metode pengiriman untuk melanjutkan
                                            </div>
                                        )}
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
