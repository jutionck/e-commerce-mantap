import React, { useState } from 'react';
import { useToastContext } from '@/contexts/ToastContext';

const CopyButton = ({ 
    text, 
    label = 'teks',
    variant = 'default', 
    size = 'sm',
    className = '',
    children 
}) => {
    const [isCopied, setIsCopied] = useState(false);
    const { success, error } = useToastContext();

    const copyToClipboard = async () => {
        if (isCopied) return; // Prevent double clicks
        
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                success(`${label} berhasil disalin! 📋`, 2500);
            } else {
                // Fallback for older browsers
                fallbackCopyToClipboard();
            }
            
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
            
        } catch (err) {
            fallbackCopyToClipboard();
        }
    };

    const fallbackCopyToClipboard = () => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        textarea.style.top = '-999999px';
        document.body.appendChild(textarea);
        
        try {
            textarea.focus();
            textarea.select();
            const successful = document.execCommand('copy');
            
            if (successful) {
                success(`${label} berhasil disalin! 📋`, 2500);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            } else {
                error(`Gagal menyalin ${label}. Silakan salin manual: ${text}`, 4000);
            }
        } catch (err) {
            error(`Gagal menyalin ${label}. Silakan salin manual: ${text}`, 4000);
        } finally {
            document.body.removeChild(textarea);
        }
    };

    const getVariantClasses = () => {
        switch (variant) {
            case 'success':
                return 'bg-green-600 hover:bg-green-700 text-white';
            case 'info':
                return 'bg-blue-600 hover:bg-blue-700 text-white';
            case 'warning':
                return 'bg-orange-600 hover:bg-orange-700 text-white';
            case 'outline':
                return 'border border-gray-300 hover:bg-gray-50 text-gray-700';
            case 'ghost':
                return 'hover:bg-gray-100 text-gray-600';
            default:
                return 'bg-gray-600 hover:bg-gray-700 text-white';
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'xs':
                return 'px-2 py-1 text-xs';
            case 'sm':
                return 'px-3 py-2 text-sm';
            case 'md':
                return 'px-4 py-2 text-base';
            case 'lg':
                return 'px-6 py-3 text-lg';
            default:
                return 'px-3 py-2 text-sm';
        }
    };

    return (
        <button
            onClick={copyToClipboard}
            disabled={isCopied}
            className={`
                ${getVariantClasses()}
                ${getSizeClasses()}
                rounded-lg font-medium
                transition-all duration-200
                flex items-center space-x-2
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed
                transform active:scale-95
                ${className}
            `}
        >
            {isCopied ? (
                <>
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Tersalin!</span>
                </>
            ) : (
                <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {children || <span>Copy</span>}
                </>
            )}
        </button>
    );
};

export default CopyButton;