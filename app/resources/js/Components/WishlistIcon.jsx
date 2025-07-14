import React from 'react';
import { Link } from '@inertiajs/react';
import { Heart } from 'lucide-react';

export default function WishlistIcon({ wishlistCount = 0, className = "" }) {
    return (
        <Link
            href={route('wishlist.index')}
            className={`relative p-2 text-gray-600 hover:text-red-500 transition-colors ${className}`}
            title="My Wishlist"
        >
            <Heart 
                className={`w-6 h-6 transition-colors ${wishlistCount > 0 ? 'text-red-500 fill-red-500' : ''}`} 
            />
            
            {/* Wishlist Count Badge */}
            {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium min-w-[1.25rem]">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
            )}
        </Link>
    );
}