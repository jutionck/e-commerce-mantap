import React from 'react';
import CopyButton from '@/Components/ui/CopyButton';

const PaymentInstructions = ({ paymentData }) => {
    const { payment_instructions, status, payment_type } = paymentData;

    if (!payment_instructions || status === 'settlement') {
        return null;
    }


    const renderQRCode = () => {
        if (payment_instructions.qr_code_url) {
            return (
                <div className="text-center mb-4">
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <img 
                            src={payment_instructions.qr_code_url} 
                            alt="QR Code" 
                            className="mx-auto max-w-xs border rounded-lg shadow-sm"
                        />
                        <div className="mt-4 flex justify-center space-x-3">
                            <CopyButton
                                text={payment_instructions.qr_code_url}
                                label="Link QR Code"
                                variant="outline"
                                size="sm"
                            >
                                <span>Copy Link QR</span>
                            </CopyButton>
                            <a
                                href={payment_instructions.qr_code_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                <span>Buka</span>
                            </a>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    const renderVirtualAccount = () => {
        if (payment_instructions.va_number && payment_instructions.bank) {
            return (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-700 font-medium">Virtual Account {payment_instructions.bank}</p>
                            <p className="text-2xl font-mono font-bold text-blue-900">{payment_instructions.va_number}</p>
                        </div>
                        <CopyButton
                            text={payment_instructions.va_number}
                            label="Nomor Virtual Account"
                            variant="info"
                        />
                    </div>
                </div>
            );
        }
        return null;
    };

    const renderPaymentCode = () => {
        if (payment_instructions.payment_code) {
            return (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-700 font-medium">Kode Pembayaran {payment_instructions.store}</p>
                            <p className="text-2xl font-mono font-bold text-green-900">{payment_instructions.payment_code}</p>
                        </div>
                        <CopyButton
                            text={payment_instructions.payment_code}
                            label="Kode Pembayaran"
                            variant="success"
                        />
                    </div>
                </div>
            );
        }
        return null;
    };

    const renderDeepLink = () => {
        if (payment_instructions.deeplink) {
            return (
                <div className="mb-4">
                    <a
                        href={payment_instructions.deeplink}
                        className="block w-full text-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                        Buka di Aplikasi GoPay
                    </a>
                </div>
            );
        }
        return null;
    };

    const getStatusColor = () => {
        switch (status) {
            case 'pending':
                return 'text-yellow-600 bg-yellow-100';
            case 'settlement':
                return 'text-green-600 bg-green-100';
            case 'failed':
            case 'expire':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'pending':
                return '⏳ Menunggu Pembayaran';
            case 'settlement':
                return '✅ Pembayaran Berhasil';
            case 'failed':
                return '❌ Pembayaran Gagal';
            case 'expire':
                return '⏰ Pembayaran Expired';
            default:
                return '📝 Memproses Pembayaran';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            {/* Status Badge */}
            <div className="mb-4">
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                    {getStatusText()}
                </span>
            </div>

            {/* Payment Title */}
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {payment_instructions.title || 'Instruksi Pembayaran'}
            </h3>

            {/* Payment Details */}
            {renderVirtualAccount()}
            {renderPaymentCode()}
            {renderQRCode()}
            {renderDeepLink()}

            {/* Steps */}
            {payment_instructions.steps && payment_instructions.steps.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Langkah Pembayaran:</h4>
                    <ol className="space-y-2">
                        {payment_instructions.steps.map((step, index) => (
                            <li key={index} className="flex items-start space-x-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                    {index + 1}
                                </span>
                                <span className="text-gray-700">{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.865-.833-2.635 0L4.179 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div className="text-sm text-yellow-700">
                        <p className="font-medium mb-1">Catatan Penting:</p>
                        <ul className="space-y-1">
                            <li>• Pembayaran akan dikonfirmasi otomatis dalam 1-5 menit</li>
                            <li>• Jangan tutup halaman ini hingga pembayaran selesai</li>
                            <li>• Simpan bukti pembayaran untuk referensi</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentInstructions;