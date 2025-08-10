import React, { useState } from 'react';

const PaymentMethodSelector = ({ availablePaymentMethods, onSelect }) => {
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [selectedBank, setSelectedBank] = useState(null);
    const [selectedStore, setSelectedStore] = useState(null);

    const handleMethodSelect = (methodKey) => {
        setSelectedMethod(methodKey);
        setSelectedBank(null);
        setSelectedStore(null);
        
        if (methodKey === 'qris') {
            onSelect(methodKey, {});
        }
    };

    const handleBankSelect = (bank) => {
        setSelectedBank(bank);
        onSelect(selectedMethod, { bank });
    };

    const handleStoreSelect = (store) => {
        setSelectedStore(store);
        onSelect(selectedMethod, { store });
    };

    const getMethodIcon = (icon) => {
        const icons = {
            'bank': (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-3 4h1m-1 4h1" />
                </svg>
            ),
            'credit-card': (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
            'gopay': (
                <div className="w-6 h-6 bg-green-500 rounded text-white text-xs font-bold flex items-center justify-center">GP</div>
            ),
            'qris': (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
            ),
            'shopeepay': (
                <div className="w-6 h-6 bg-orange-500 rounded text-white text-xs font-bold flex items-center justify-center">SP</div>
            ),
            'store': (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-3 4h1m-1 4h1" />
                </svg>
            )
        };
        return icons[icon] || <div className="w-6 h-6 bg-gray-300 rounded"></div>;
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Pilih Metode Pembayaran</h3>
            
            <div className="grid grid-cols-1 gap-3">
                {Object.entries(availablePaymentMethods).map(([methodKey, method]) => (
                    <div key={methodKey} className="border rounded-lg overflow-hidden">
                        <button
                            onClick={() => handleMethodSelect(methodKey)}
                            className={`w-full p-4 text-left flex items-center space-x-3 hover:bg-gray-50 transition-colors ${
                                selectedMethod === methodKey ? 'bg-blue-50 border-blue-500' : 'border-gray-200'
                            }`}
                        >
                            <div className="flex-shrink-0">
                                {getMethodIcon(method.icon)}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{method.name}</h4>
                                <p className="text-sm text-gray-600">{method.description}</p>
                                {method.features && (
                                    <div className="flex space-x-2 mt-1">
                                        {method.features.map((feature) => (
                                            <span
                                                key={feature}
                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                            >
                                                {feature === 'instant' && '⚡ Instan'}
                                                {feature === 'qr_code' && '📱 QR Code'}
                                                {feature === 'deeplink' && '🔗 DeepLink'}
                                                {feature === 'installment' && '💳 Cicilan'}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex-shrink-0">
                                <input
                                    type="radio"
                                    checked={selectedMethod === methodKey}
                                    onChange={() => {}}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                            </div>
                        </button>

                        {/* Bank selection for Virtual Account */}
                        {selectedMethod === methodKey && method.banks && (
                            <div className="border-t bg-gray-50 p-4">
                                <p className="text-sm font-medium text-gray-700 mb-3">Pilih Bank:</p>
                                <div className="grid grid-cols-1 gap-2">
                                    {Object.entries(method.banks).map(([bankKey, bank]) => (
                                        <button
                                            key={bankKey}
                                            onClick={() => handleBankSelect(bankKey)}
                                            className={`p-3 text-left rounded-lg border transition-colors ${
                                                selectedBank === bankKey
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-900">{bank.name}</span>
                                                <input
                                                    type="radio"
                                                    checked={selectedBank === bankKey}
                                                    onChange={() => {}}
                                                    className="text-blue-600 focus:ring-blue-500"
                                                />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Store selection for Convenience Store */}
                        {selectedMethod === methodKey && method.stores && (
                            <div className="border-t bg-gray-50 p-4">
                                <p className="text-sm font-medium text-gray-700 mb-3">Pilih Store:</p>
                                <div className="grid grid-cols-1 gap-2">
                                    {Object.entries(method.stores).map(([storeKey, store]) => (
                                        <button
                                            key={storeKey}
                                            onClick={() => handleStoreSelect(storeKey)}
                                            className={`p-3 text-left rounded-lg border transition-colors ${
                                                selectedStore === storeKey
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-900">{store.name}</span>
                                                <input
                                                    type="radio"
                                                    checked={selectedStore === storeKey}
                                                    onChange={() => {}}
                                                    className="text-blue-600 focus:ring-blue-500"
                                                />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentMethodSelector;