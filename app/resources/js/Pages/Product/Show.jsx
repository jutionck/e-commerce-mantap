import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Show({ auth, product, relatedProducts = [] }) {
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    const { setData, post, processing, errors } = useForm({
        product_id: product.id,
        quantity: selectedQuantity,
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-100', available: false };
        if (stock <= 10) return { text: 'Low Stock', color: 'text-orange-600 bg-orange-100', available: true };
        return { text: 'In Stock', color: 'text-green-600 bg-green-100', available: true };
    };

    const stockStatus = getStockStatus(product.stock);

    const handleQuantityChange = (newQuantity) => {
        const quantity = Math.max(1, Math.min(newQuantity, product.stock));
        setSelectedQuantity(quantity);
        setData('quantity', quantity);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (!auth?.user) {
            // Redirect to login if not authenticated
            window.location.href = route('login');
            return;
        }
        post(route('cart.store'));
    };

    const Layout = auth?.user ? AuthenticatedLayout : GuestLayout;

    return (
        <Layout user={auth?.user}>
            <Head title={product.name} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="mb-8" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2 text-sm text-gray-600">
                        <li>
                            <Link href="/" className="hover:text-gray-900 transition-colors">
                                Home
                            </Link>
                        </li>
                        <li className="flex items-center">
                            <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-blue-600 font-medium">{product.category.name}</span>
                        </li>
                        <li className="flex items-center">
                            <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-900 font-medium">{product.name}</span>
                        </li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                            <img
                                src="/images/product_placeholder.png"
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        
                        {/* Thumbnail Gallery (Placeholder for multiple images) */}
                        <div className="grid grid-cols-4 gap-2">
                            {[1, 2, 3, 4].map((index) => (
                                <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-500 transition-colors">
                                    <img
                                        src="/images/product_placeholder.png"
                                        alt={`${product.name} view ${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Category Badge */}
                        <div className="text-sm text-blue-600 font-medium uppercase tracking-wide">
                            {product.category.name}
                        </div>

                        {/* Product Name */}
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div className="space-y-2">
                            <div className="text-3xl font-bold text-gray-900">
                                {formatPrice(product.price)}
                            </div>
                            {product.original_price && product.original_price > product.price && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg text-gray-500 line-through">
                                        {formatPrice(product.original_price)}
                                    </span>
                                    <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                                        Save {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center space-x-3">
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color}`}>
                                {stockStatus.text}
                            </span>
                            <span className="text-sm text-gray-600">
                                {product.stock} items available
                            </span>
                        </div>

                        {/* Add to Cart Form */}
                        <form onSubmit={handleAddToCart} className="space-y-4">
                            {/* Quantity Selector */}
                            <div className="space-y-2">
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                    Quantity
                                </label>
                                <div className="flex items-center space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => handleQuantityChange(selectedQuantity - 1)}
                                        disabled={selectedQuantity <= 1}
                                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                        </svg>
                                    </button>
                                    
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        value={selectedQuantity}
                                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                        min="1"
                                        max={product.stock}
                                        className="w-20 text-center border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    
                                    <button
                                        type="button"
                                        onClick={() => handleQuantityChange(selectedQuantity + 1)}
                                        disabled={selectedQuantity >= product.stock}
                                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </button>
                                </div>
                                {errors.quantity && (
                                    <p className="text-sm text-red-600">{errors.quantity}</p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                {stockStatus.available ? (
                                    <>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className={`w-full py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-200 ${
                                                processing
                                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                                            }`}
                                        >
                                            {processing ? (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    <span>Adding to Cart...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H2m5 8l4-4m0 0l4 4m-4-4v12" />
                                                    </svg>
                                                    <span>Add to Cart</span>
                                                </div>
                                            )}
                                        </button>
                                        
                                        <button
                                            type="button"
                                            className="w-full py-4 px-6 border-2 border-blue-600 text-blue-600 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
                                        >
                                            Add to Wishlist
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full py-4 px-6 bg-gray-100 text-gray-500 rounded-xl text-lg font-semibold text-center">
                                        Out of Stock
                                    </div>
                                )}

                                {!auth?.user && (
                                    <p className="text-sm text-gray-600 text-center">
                                        <Link href={route('login')} className="text-blue-600 hover:underline">
                                            Sign in
                                        </Link> to add items to your cart
                                    </p>
                                )}
                            </div>
                        </form>

                        {/* Product Features */}
                        <div className="border-t pt-6">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Free Shipping</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Quality Guaranteed</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                    </svg>
                                    <span>Easy Returns</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364" />
                                    </svg>
                                    <span>24/7 Support</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="border-t pt-12">
                    <div className="mb-8">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('description')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === 'description'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Description
                                </button>
                                <button
                                    onClick={() => setActiveTab('specifications')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === 'specifications'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Specifications
                                </button>
                                <button
                                    onClick={() => setActiveTab('shipping')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === 'shipping'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Shipping & Returns
                                </button>
                            </nav>
                        </div>

                        <div className="mt-8">
                            {activeTab === 'description' && (
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 leading-relaxed">
                                        {product.description || 'No description available for this product.'}
                                    </p>
                                </div>
                            )}

                            {activeTab === 'specifications' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <dt className="font-medium text-gray-900">Category</dt>
                                            <dd className="text-gray-700">{product.category.name}</dd>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <dt className="font-medium text-gray-900">SKU</dt>
                                            <dd className="text-gray-700">{product.slug}</dd>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <dt className="font-medium text-gray-900">Availability</dt>
                                            <dd className="text-gray-700">{product.stock} in stock</dd>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <dt className="font-medium text-gray-900">Product ID</dt>
                                            <dd className="text-gray-700">#{product.id}</dd>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'shipping' && (
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Shipping Information</h4>
                                        <ul className="text-gray-700 space-y-1">
                                            <li>• Free shipping on orders over IDR 500,000</li>
                                            <li>• Standard delivery: 2-5 business days</li>
                                            <li>• Express delivery: 1-2 business days (additional cost applies)</li>
                                            <li>• International shipping available</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Returns & Exchanges</h4>
                                        <ul className="text-gray-700 space-y-1">
                                            <li>• 30-day return policy</li>
                                            <li>• Items must be in original condition</li>
                                            <li>• Free returns for defective items</li>
                                            <li>• Return shipping costs may apply</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="border-t pt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.slice(0, 4).map(relatedProduct => (
                                <div key={relatedProduct.id} className="group">
                                    <Link href={`/products/${relatedProduct.id}`} className="block">
                                        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                                            <div className="relative h-48 bg-gray-100 overflow-hidden">
                                                <img
                                                    src="/images/product_placeholder.png"
                                                    alt={relatedProduct.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <div className="text-xs text-blue-600 font-medium mb-1 uppercase tracking-wide">
                                                    {relatedProduct.category.name}
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                                    {relatedProduct.name}
                                                </h3>
                                                <div className="text-xl font-bold text-gray-900">
                                                    {formatPrice(relatedProduct.price)}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}