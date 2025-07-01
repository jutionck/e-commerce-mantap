import React from 'react';

export default function Index({ products, categories }) {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Product Catalog</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                    <h2 className="text-xl font-semibold mb-2">Categories</h2>
                    <ul className="space-y-2">
                        {categories.map(category => (
                            <li key={category.id}>
                                <a href="#" className="text-blue-500 hover:underline">{category.name}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="md:col-span-3">
                    <h2 className="text-2xl font-semibold mb-4">Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map(product => (
                            <div key={product.id} className="border rounded-lg p-4">
                                <a href={`/products/${product.id}`}>
                                    <img src="/images/product_placeholder.png" alt={product.name} className="w-full h-48 object-cover mb-2"/>
                                    <h3 className="text-lg font-semibold">{product.name}</h3>
                                </a>
                                <p className="text-gray-500">{product.category.name}</p>
                                <p className="text-lg font-bold mt-2">${product.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
