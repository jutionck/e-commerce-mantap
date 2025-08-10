import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

const PaymentCountdown = ({ order, onExpiry }) => {
    const [timeLeft, setTimeLeft] = useState(null);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        // Calculate expiry time (24 hours from creation)
        const createdAt = new Date(order.created_at);
        const expiryTime = new Date(createdAt.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
        
        const updateCountdown = () => {
            const now = new Date();
            const difference = expiryTime.getTime() - now.getTime();

            if (difference <= 0) {
                setIsExpired(true);
                setTimeLeft(null);
                if (onExpiry) {
                    onExpiry();
                }
                return;
            }

            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft({ hours, minutes, seconds });
        };

        // Update immediately
        updateCountdown();

        // Update every second
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [order.created_at, onExpiry]);

    if (isExpired) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-red-800">Pembayaran Expired</h3>
                        <p className="text-red-700 mt-1">
                            Waktu pembayaran telah berakhir. Pesanan akan dibatalkan secara otomatis.
                        </p>
                        <button
                            onClick={() => router.visit(route('payments.expired', order.id))}
                            className="mt-2 text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Lihat Detail
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!timeLeft) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <div className="animate-pulse">
                    <div className="text-center">
                        <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
                        <div className="h-8 bg-gray-300 rounded w-48 mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    const isUrgent = timeLeft.hours === 0 && timeLeft.minutes < 30; // Less than 30 minutes
    const isVeryUrgent = timeLeft.hours === 0 && timeLeft.minutes < 10; // Less than 10 minutes

    const bgColor = isVeryUrgent ? 'bg-red-50 border-red-200' : 
                   isUrgent ? 'bg-orange-50 border-orange-200' : 
                   'bg-blue-50 border-blue-200';

    const textColor = isVeryUrgent ? 'text-red-800' : 
                     isUrgent ? 'text-orange-800' : 
                     'text-blue-800';

    const iconColor = isVeryUrgent ? 'text-red-600' : 
                     isUrgent ? 'text-orange-600' : 
                     'text-blue-600';

    const numberBg = isVeryUrgent ? 'bg-red-100 text-red-800' : 
                    isUrgent ? 'bg-orange-100 text-orange-800' : 
                    'bg-blue-100 text-blue-800';

    return (
        <div className={`${bgColor} border rounded-lg p-4 mb-6`}>
            <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                    <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className={`text-lg font-medium ${textColor}`}>
                        {isVeryUrgent ? '⚠️ Segera Bayar!' : 
                         isUrgent ? '🔔 Waktu Terbatas!' : 
                         '⏰ Waktu Pembayaran'}
                    </h3>
                    <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-2">
                            <div className={`${numberBg} rounded-lg px-3 py-1 text-center min-w-[3rem]`}>
                                <div className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
                                <div className="text-xs uppercase tracking-wide">Jam</div>
                            </div>
                            <div className={`${textColor} text-2xl font-bold`}>:</div>
                            <div className={`${numberBg} rounded-lg px-3 py-1 text-center min-w-[3rem]`}>
                                <div className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                                <div className="text-xs uppercase tracking-wide">Menit</div>
                            </div>
                            <div className={`${textColor} text-2xl font-bold`}>:</div>
                            <div className={`${numberBg} rounded-lg px-3 py-1 text-center min-w-[3rem]`}>
                                <div className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                                <div className="text-xs uppercase tracking-wide">Detik</div>
                            </div>
                        </div>
                    </div>
                    <p className={`${textColor} text-sm mt-2`}>
                        {isVeryUrgent ? 'Pesanan akan dibatalkan otomatis jika tidak dibayar dalam waktu tersisa.' :
                         isUrgent ? 'Segera lakukan pembayaran sebelum waktu habis.' :
                         'Selesaikan pembayaran sebelum waktu habis untuk menghindari pembatalan otomatis.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentCountdown;