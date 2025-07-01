import React from 'react';
import { useForm } from '@inertiajs/react';

export default function Show({ product }) {
    const { data, setData, post, processing, errors } = useForm({
        product_id: product.id,
        quantity: 1,
    });

    function submit(e) {
        e.preventDefault();
        post(route('cart.store'));
    }

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <img src="/images/product_placeholder.png" alt={product.name} className="w-full h-auto object-cover rounded-lg"/>
                </div>
                <div>
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <p className="text-gray-500 mb-4">{product.category.name}</p>
                    <p className="text-lg mb-4">{product.description}</p>
                    <p className="text-2xl font-bold mb-4">${product.price}</p>
                    <form onSubmit={submit}>
                        <div className="flex items-center mb-4">
                            <label htmlFor="quantity" className="mr-2">Quantity:</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={data.quantity}
                                min="1"
                                onChange={(e) => setData('quantity', e.target.value)}
                                className="border rounded-lg p-2 w-20"
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" disabled={processing}>
                            Add to Cart
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
