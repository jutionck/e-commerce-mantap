import React from 'react';
import { useForm, Link } from '@inertiajs/react';

function CartItem({ item, productId }) {
    const { data, setData, patch, delete: destroy, processing } = useForm({
        quantity: item.quantity,
    });

    function handleUpdate() {
        patch(route('cart.update', productId));
    }

    function handleRemove() {
        destroy(route('cart.destroy', productId));
    }

    return (
        <div className="grid grid-cols-5 gap-4 items-center mb-2">
            <div>{item.name}</div>
            <div>
                <input
                    type="number"
                    value={data.quantity}
                    onChange={(e) => setData('quantity', e.target.value)}
                    onBlur={handleUpdate}
                    className="border rounded-lg p-2 w-20"
                    min="1"
                />
            </div>
            <div>${item.price}</div>
            <div>${item.price * item.quantity}</div>
            <div>
                <button onClick={handleRemove} className="text-red-500 hover:underline" disabled={processing}>
                    Remove
                </button>
            </div>
        </div>
    );
}

export default function Index({ cart }) {
    const total = Object.values(cart).reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
            {Object.keys(cart).length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    <div className="grid grid-cols-5 gap-4 mb-4 font-bold">
                        <div>Product</div>
                        <div>Quantity</div>
                        <div>Price</div>
                        <div>Total</div>
                        <div>Actions</div>
                    </div>
                    {Object.entries(cart).map(([productId, item]) => (
                        <CartItem key={productId} productId={productId} item={item} />
                    ))}
                    <div className="text-right text-2xl font-bold mt-4">Total: ${total.toFixed(2)}</div>
                    <div className="flex justify-end mt-4">
                        <Link href={route('checkout.index')} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Proceed to Checkout</Link>
                    </div>
                </div>
            )}
        </div>
    );
}
