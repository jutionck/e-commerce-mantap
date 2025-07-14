import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function WishlistButton({ 
    product, 
    isWishlisted = false, 
    className = '', 
    size = 'sm',
    showText = false,
    auth = null,
    onLoginRequired = null 
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [wishlisted, setWishlisted] = useState(isWishlisted);

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Check if user is logged in
        if (!auth?.user) {
            if (onLoginRequired) {
                onLoginRequired();
            } else {
                // Show toast asking to login
                const toast = document.createElement('div');
                toast.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
                toast.innerHTML = `
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Please login to save items to wishlist</span>
                `;
                document.body.appendChild(toast);
                setTimeout(() => {
                    toast.style.transform = 'translateX(100%)';
                    setTimeout(() => document.body.removeChild(toast), 300);
                }, 4000);
            }
            return;
        }

        setIsLoading(true);

        router.post(`/wishlist/${product.id}/toggle`, {}, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                // Toggle the local state
                setWishlisted(!wishlisted);
                
                // Show toast notification
                const toast = document.createElement('div');
                const isNowWishlisted = !wishlisted;
                toast.className = `fixed top-4 right-4 ${isNowWishlisted ? 'bg-pink-500' : 'bg-gray-500'} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2`;
                toast.innerHTML = `
                    <svg class="h-5 w-5" fill="${isNowWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>${isNowWishlisted ? 'Added to wishlist' : 'Removed from wishlist'}</span>
                `;
                document.body.appendChild(toast);
                setTimeout(() => {
                    toast.style.transform = 'translateX(100%)';
                    setTimeout(() => document.body.removeChild(toast), 300);
                }, 3000);
                
                setIsLoading(false);
            },
            onError: (errors) => {
                console.error('Error toggling wishlist:', errors);
                
                const toast = document.createElement('div');
                toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
                toast.innerHTML = `
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Please login to add to wishlist</span>
                `;
                document.body.appendChild(toast);
                setTimeout(() => {
                    toast.style.transform = 'translateX(100%)';
                    setTimeout(() => document.body.removeChild(toast), 300);
                }, 3000);
                
                setIsLoading(false);
            }
        });
    };

    const getIconSize = () => {
        switch (size) {
            case 'xs': return 'w-3 h-3';
            case 'sm': return 'w-4 h-4';
            case 'md': return 'w-5 h-5';
            case 'lg': return 'w-6 h-6';
            default: return 'w-4 h-4';
        }
    };

    const getButtonSize = () => {
        switch (size) {
            case 'xs': return 'p-1';
            case 'sm': return 'p-2';
            case 'md': return 'p-2.5';
            case 'lg': return 'p-3';
            default: return 'p-2';
        }
    };

    return (
        <button
            onClick={handleWishlistToggle}
            disabled={isLoading}
            className={`
                ${getButtonSize()}
                bg-white/80 hover:bg-white rounded-full shadow-md 
                transition-all duration-200 hover:scale-110
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
            `}
            title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <Heart 
                className={`
                    ${getIconSize()}
                    transition-colors duration-200
                    ${wishlisted 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-gray-600 hover:text-red-500'
                    }
                    ${isLoading ? 'animate-pulse' : ''}
                `}
            />
            {showText && (
                <span className="ml-2 text-sm font-medium">
                    {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </span>
            )}
        </button>
    );
}