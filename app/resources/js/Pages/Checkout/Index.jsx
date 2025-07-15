import React, { useState, useEffect } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import axios from 'axios';

export default function Index({ cartItems, totalAmount, addresses, defaultAddress }) {
    const [shippingOptions, setShippingOptions] = useState([]);
    const [selectedShipping, setSelectedShipping] = useState(null);
    const [addressOption, setAddressOption] = useState(defaultAddress ? 'saved' : 'new');
    const [selectedAddress, setSelectedAddress] = useState(defaultAddress || null);

    const { data, setData, post, processing, errors } = useForm({
        address_option: defaultAddress ? 'saved' : 'new',
        selected_address_id: defaultAddress?.id || '',
        shipping_address: {
            name: '',
            phone: '',
            address: '',
            city: '',
            postal_code: '',
        },
        save_address: false,
        address_label: '',
        shipping_method: '',
        shipping_cost: '',
    });

    // Update form data when address option changes
    useEffect(() => {
        setData('address_option', addressOption);
        if (addressOption === 'saved' && selectedAddress?.id) {
            setData('selected_address_id', selectedAddress.id);
        } else {
            setData('selected_address_id', '');
        }
    }, [addressOption, selectedAddress]);

    // Ensure selected address is valid on component mount
    useEffect(() => {
        if (defaultAddress && addresses.length > 0) {
            const validAddress = addresses.find(addr => addr.id === defaultAddress.id);
            if (validAddress) {
                setSelectedAddress(validAddress);
                setData('selected_address_id', validAddress.id);
            } else {
                // Default address not found in current user's addresses, reset
                setSelectedAddress(null);
                setAddressOption('new');
                setData('address_option', 'new');
                setData('selected_address_id', '');
            }
        }
    }, [addresses, defaultAddress]);

    async function getShippingOptions() {
        let city = '';
        
        if (addressOption === 'saved' && selectedAddress) {
            city = selectedAddress.city;
        } else if (addressOption === 'new') {
            city = data.shipping_address.city;
        }

        if (!city.trim()) {
            alert('Mohon isi atau pilih alamat terlebih dahulu');
            return;
        }

        // Calculate total weight from cart items
        const totalWeight = cartItems.reduce((total, item) => {
            const productWeight = item.product.weight || 1000; // Default 1kg if not specified
            return total + (productWeight * item.quantity);
        }, 0);
        
        try {
            const response = await axios.post('/shipping-cost', {
                destination: city,
                weight: totalWeight,
            });
            
            // Handle different response formats
            if (response.data.options) {
                setShippingOptions(response.data.options);
            } else if (response.data.fallback_options) {
                setShippingOptions(response.data.fallback_options);
                alert('Menggunakan estimasi harga pengiriman karena data kota tidak ditemukan');
            } else if (Array.isArray(response.data)) {
                // Legacy format support
                setShippingOptions(response.data);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Shipping cost error:', error);
            
            if (error.response?.data) {
                const errorData = error.response.data;
                
                if (errorData.fallback_options || errorData.options) {
                    setShippingOptions(errorData.fallback_options || errorData.options);
                    
                    // Show appropriate message
                    if (errorData.info) {
                        alert(`${errorData.message || errorData.error}\n\n${errorData.info}`);
                    } else if (errorData.suggestion) {
                        alert(`${errorData.error}\n\n${errorData.suggestion}\n\nContoh kota: ${errorData.example_cities?.join(', ')}`);
                    } else {
                        alert(errorData.message || errorData.error || 'Menggunakan estimasi harga pengiriman');
                    }
                } else {
                    alert('Gagal mengambil opsi pengiriman. Coba lagi.');
                }
            } else {
                alert('Gagal mengambil opsi pengiriman. Coba lagi.');
            }
        }
    }

    function handleShippingSelect(option) {
        setSelectedShipping(option);
        setData('shipping_method', option.name);
        setData('shipping_cost', option.cost);
    }

    function handleAddressSelect(address) {
        if (!address || !address.id) {
            console.error('Invalid address selected:', address);
            return;
        }
        
        console.log('Address selected:', address);
        setSelectedAddress(address);
        setData('selected_address_id', address.id);
        // Clear shipping options when address changes
        setShippingOptions([]);
        setSelectedShipping(null);
        setData('shipping_method', '');
        setData('shipping_cost', '');
    }

    function submit(e) {
        e.preventDefault();
        
        // Debug: Log form data before submission
        console.log('Form data being submitted:', data);
        console.log('Address option:', addressOption);
        console.log('Selected address:', selectedAddress);
        console.log('Selected shipping:', selectedShipping);
        
        // Client-side validation
        if (addressOption === 'saved' && (!selectedAddress || !selectedAddress.id)) {
            alert('Please select a saved address or choose to enter a new address.');
            return;
        }
        
        if (!data.shipping_method || !data.shipping_cost) {
            alert('Please select a shipping method.');
            return;
        }

        // Additional validation for new address
        if (addressOption === 'new') {
            const requiredFields = ['name', 'phone', 'address', 'city', 'postal_code'];
            const missingFields = [];

            requiredFields.forEach(field => {
                if (!data.shipping_address[field] || data.shipping_address[field].trim() === '') {
                    missingFields.push(field);
                }
            });

            if (missingFields.length > 0) {
                alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
                return;
            }
        }

        // Prepare data based on address option
        let submitData = {
            address_option: addressOption,
            shipping_method: data.shipping_method,
            shipping_cost: data.shipping_cost,
        };

        if (addressOption === 'saved') {
            submitData.selected_address_id = selectedAddress.id;
        } else {
            submitData.shipping_address = data.shipping_address;
            submitData.save_address = data.save_address;
            if (data.save_address && data.address_label) {
                submitData.address_label = data.address_label;
            }
        }

        console.log('Processed submit data:', submitData);
        
        post(route('checkout.store'), {
            data: submitData,
            onSuccess: () => {
                console.log('Checkout successful');
            },
            onError: (errors) => {
                console.log('Checkout errors:', errors);
                // Scroll to error display
                const errorElement = document.querySelector('.bg-red-50');
                if (errorElement) {
                    errorElement.scrollIntoView({ behavior: 'smooth' });
                }
            },
            onFinish: () => {
                console.log('Checkout request finished');
            }
        });
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const subtotal = totalAmount;
    const shippingCost = selectedShipping ? selectedShipping.cost : 0;
    const total = subtotal + shippingCost;

    // Debug logging for form state
    useEffect(() => {
        console.log('Form data updated:', data);
        console.log('Processing state:', processing);
        console.log('Errors:', errors);
    }, [data, processing, errors]);

    return (
        <AuthenticatedLayout>
            <Head title="Checkout" />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11h8" />
                            </svg>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                            Secure Checkout
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Complete your order with secure payment processing
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-4 relative">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Shipping Address Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="shadow-xl border-0 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Shipping Address
                                </h2>
                            </div>
                            <CardContent className="p-6">
                                <form onSubmit={submit} className="space-y-6">
                                    {addresses.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex space-x-6">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="address_option"
                                                        value="saved"
                                                        checked={addressOption === 'saved'}
                                                        onChange={(e) => setAddressOption(e.target.value)}
                                                        className="text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="font-medium">Use Saved Address</span>
                                                </label>
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="address_option"
                                                        value="new"
                                                        checked={addressOption === 'new'}
                                                        onChange={(e) => setAddressOption(e.target.value)}
                                                        className="text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="font-medium">Enter New Address</span>
                                                </label>
                                            </div>

                                            {addressOption === 'saved' && (
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="font-medium text-gray-900">Select Address</h3>
                                                        <Link href={route('addresses.create')} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                                            + Add New Address
                                                        </Link>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {addresses.map((address) => (
                                                            <div
                                                                key={address.id}
                                                                className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                                                                    selectedAddress?.id === address.id
                                                                        ? 'border-blue-500 bg-blue-50 shadow-md'
                                                                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                                                }`}
                                                                onClick={() => handleAddressSelect(address)}
                                                            >
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center space-x-2 mb-2">
                                                                            <h4 className="font-semibold text-gray-900">{address.name}</h4>
                                                                            {address.label && (
                                                                                <Badge variant="outline" className="text-xs">
                                                                                    {address.label}
                                                                                </Badge>
                                                                            )}
                                                                            {address.is_default && (
                                                                                <Badge className="text-xs bg-green-100 text-green-800">
                                                                                    Default
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-sm text-gray-600 mb-1">{address.phone}</p>
                                                                        <p className="text-sm text-gray-600">{address.full_address}</p>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <input
                                                                            type="radio"
                                                                            name="selected_address"
                                                                            value={address.id}
                                                                            checked={selectedAddress?.id === address.id}
                                                                            onChange={() => handleAddressSelect(address)}
                                                                            className="text-blue-600 focus:ring-blue-500"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {addressOption === 'new' && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Recipient Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        value={data.shipping_address.name}
                                                        onChange={e => setData('shipping_address', {...data.shipping_address, name: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                    {errors['shipping_address.name'] && (
                                                        <p className="text-red-500 text-sm mt-1">{errors['shipping_address.name']}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Phone Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="phone"
                                                        value={data.shipping_address.phone}
                                                        onChange={e => setData('shipping_address', {...data.shipping_address, phone: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                    {errors['shipping_address.phone'] && (
                                                        <p className="text-red-500 text-sm mt-1">{errors['shipping_address.phone']}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Complete Address
                                                </label>
                                                <textarea
                                                    id="address"
                                                    value={data.shipping_address.address}
                                                    onChange={e => setData('shipping_address', {...data.shipping_address, address: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    rows="3"
                                                    required
                                                />
                                                {errors['shipping_address.address'] && (
                                                    <p className="text-red-500 text-sm mt-1">{errors['shipping_address.address']}</p>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                                        City
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="city"
                                                        value={data.shipping_address.city}
                                                        onChange={e => setData('shipping_address', {...data.shipping_address, city: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                    {errors['shipping_address.city'] && (
                                                        <p className="text-red-500 text-sm mt-1">{errors['shipping_address.city']}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Postal Code
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="postal_code"
                                                        value={data.shipping_address.postal_code}
                                                        onChange={e => setData('shipping_address', {...data.shipping_address, postal_code: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                    {errors['shipping_address.postal_code'] && (
                                                        <p className="text-red-500 text-sm mt-1">{errors['shipping_address.postal_code']}</p>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="border-t pt-4">
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id="save_address"
                                                        checked={data.save_address}
                                                        onChange={e => setData('save_address', e.target.checked)}
                                                        className="text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="save_address" className="text-sm font-medium text-gray-700">
                                                        Save this address for future orders
                                                    </label>
                                                </div>
                                                {data.save_address && (
                                                    <div className="mt-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Address label (e.g., Home, Work)"
                                                            value={data.address_label}
                                                            onChange={e => setData('address_label', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* General form errors */}
                                    {Object.keys(errors).length > 0 && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <h4 className="text-red-800 font-medium mb-2">Please fix the following errors:</h4>
                                            <ul className="list-disc list-inside text-red-700 text-sm">
                                                {Object.entries(errors).map(([key, message]) => (
                                                    <li key={key}>{message}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="pt-4">
                                        <Button
                                            type="button"
                                            onClick={getShippingOptions}
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                            disabled={addressOption === 'saved' ? !selectedAddress : !data.shipping_address.city}
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            Check Shipping Options
                                        </Button>
                                    </div>

                                    {shippingOptions.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="font-medium text-gray-900">Select Shipping Method</h3>
                                            <div className="space-y-3">
                                                {shippingOptions.map(option => (
                                                    <div
                                                        key={option.name}
                                                        className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                                                            selectedShipping && selectedShipping.name === option.name
                                                                ? 'border-green-500 bg-green-50 shadow-md'
                                                                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                                        }`}
                                                        onClick={() => handleShippingSelect(option)}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-2 mb-1">
                                                                    <h4 className="font-semibold text-gray-900">{option.name}</h4>
                                                                    {option.courier_name && (
                                                                        <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                                                            {option.courier_name}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {option.description && option.description !== option.name && (
                                                                    <p className="text-sm text-gray-600 mb-1">{option.description}</p>
                                                                )}
                                                                <div className="flex items-center space-x-4 text-sm">
                                                                    <span className="font-semibold text-green-600">
                                                                        {option.formatted_cost || formatPrice(option.cost)}
                                                                    </span>
                                                                    {option.formatted_estimate && (
                                                                        <span className="text-gray-500 flex items-center">
                                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                            </svg>
                                                                            {option.formatted_estimate}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <input
                                                                    type="radio"
                                                                    name="shipping"
                                                                    value={option.name}
                                                                    checked={selectedShipping && selectedShipping.name === option.name}
                                                                    onChange={() => handleShippingSelect(option)}
                                                                    className="text-green-600 focus:ring-green-500 w-4 h-4"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedShipping && (
                                        <div className="pt-4">
                                            <Button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 text-lg font-semibold"
                                                disabled={processing}
                                            >
                                                {processing ? (
                                                    <div className="flex items-center justify-center">
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Processing...
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center">
                                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11h8" />
                                                        </svg>
                                                        Create Order
                                                    </div>
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <Card className="shadow-xl border-0 overflow-hidden sticky top-6">
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Order Summary
                                </h2>
                            </div>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item.product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">{item.product.name}</h4>
                                                <p className="text-sm text-gray-600">{formatPrice(item.price)} × {item.quantity}</p>
                                            </div>
                                            <p className="font-bold text-purple-600">{formatPrice(item.subtotal)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-medium">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="font-medium">{formatPrice(shippingCost)}</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-4 text-white shadow-lg mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold">Total</span>
                                        <span className="text-2xl font-bold">{formatPrice(total)}</span>
                                    </div>
                                </div>

                                {!selectedShipping && (
                                    <div className="mt-6 text-center text-gray-500 text-sm bg-gray-50 p-4 rounded-lg">
                                        <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        Select shipping method to continue
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}