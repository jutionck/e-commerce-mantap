import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';

// Flash sale products - would come from backend in real implementation
const flashSaleProducts = [
    {
        id: 101,
        name: "Wireless Bluetooth Headphones",
        description: "Premium noise-canceling headphones with 30-hour battery",
        price: 299000,
        originalPrice: 599000,
        stock: 8,
        category: { id: 5, name: "Elektronik" },
        primary_image: "/images/demo/smartphone.svg",
        rating: 4.7,
        reviews: 156,
        discount: 50,
        flashSaleEndTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
        soldCount: 234,
        totalStock: 50,
    },
    {
        id: 102,
        name: "Smart Fitness Watch",
        description: "Track your health with GPS, heart rate monitor, and more",
        price: 899000,
        originalPrice: 1299000,
        stock: 12,
        category: { id: 5, name: "Elektronik" },
        primary_image: "/images/demo/smartphone.svg",
        rating: 4.8,
        reviews: 89,
        discount: 31,
        flashSaleEndTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
        soldCount: 167,
        totalStock: 30,
    },
    {
        id: 103,
        name: "Designer Handbag",
        description: "Luxury leather handbag with premium craftsmanship",
        price: 450000,
        originalPrice: 750000,
        stock: 5,
        category: { id: 1, name: "Pakatan Wanita" },
        primary_image: "/images/demo/gaun.svg",
        rating: 4.6,
        reviews: 73,
        discount: 40,
        flashSaleEndTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
        soldCount: 89,
        totalStock: 25,
    },
    {
        id: 104,
        name: "Gaming Mechanical Keyboard",
        description: "RGB backlit mechanical keyboard for gaming enthusiasts",
        price: 399000,
        originalPrice: 699000,
        stock: 15,
        category: { id: 5, name: "Elektronik" },
        primary_image: "/images/demo/smartphone.svg",
        rating: 4.9,
        reviews: 201,
        discount: 43,
        flashSaleEndTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
        soldCount: 312,
        totalStock: 40,
    },
];

const FlashSaleSection = () => {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const endTime = flashSaleProducts[0]?.flashSaleEndTime?.getTime() || now;
            const distance = endTime - now;

            if (distance > 0) {
                setTimeLeft({
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                });
            } else {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 py-6 md:py-8 mb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Flash Sale Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                            <span className="text-xl md:text-2xl">⚡</span>
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">Flash Sale</h2>
                            <p className="text-white/90 text-sm">Limited time offers!</p>
                        </div>
                    </div>

                    {/* Compact Countdown Timer */}
                    <div className="flex items-center gap-2">
                        <span className="text-white/90 text-sm font-medium hidden sm:block">Ends in:</span>
                        <div className="flex gap-1">
                            <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1 text-center min-w-[30px] md:min-w-[35px]">
                                <div className="text-sm md:text-lg font-bold text-white">{String(timeLeft.hours).padStart(2, "0")}</div>
                                <div className="text-xs text-white/80">H</div>
                            </div>
                            <div className="text-white text-sm md:text-lg font-bold flex items-center">:</div>
                            <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1 text-center min-w-[30px] md:min-w-[35px]">
                                <div className="text-sm md:text-lg font-bold text-white">
                                    {String(timeLeft.minutes).padStart(2, "0")}
                                </div>
                                <div className="text-xs text-white/80">M</div>
                            </div>
                            <div className="text-white text-sm md:text-lg font-bold flex items-center">:</div>
                            <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1 text-center min-w-[30px] md:min-w-[35px]">
                                <div className="text-sm md:text-lg font-bold text-white">
                                    {String(timeLeft.seconds).padStart(2, "0")}
                                </div>
                                <div className="text-xs text-white/80">S</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Compact Flash Sale Products - Horizontal Scroll */}
                <div className="relative">
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex gap-3 md:gap-4 pb-4" style={{ width: "max-content" }}>
                            {flashSaleProducts.map((product) => {
                                const soldPercentage = (product.soldCount / (product.soldCount + product.stock)) * 100;

                                return (
                                    <Card
                                        key={product.id}
                                        className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white transform hover:scale-105 flex-shrink-0 w-48 md:w-64"
                                    >
                                        <CardContent className="p-0">
                                            {/* Compact Product Image */}
                                            <div className="relative h-24 md:h-32 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                                <img
                                                    src={product.primary_image || "/images/product_placeholder.svg"}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />

                                                {/* Flash Sale Badge */}
                                                <div className="absolute top-1 md:top-2 left-1 md:left-2">
                                                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-xs px-1.5 md:px-2 py-0.5 md:py-1 animate-pulse shadow-lg">
                                                        <span className="mr-1">⚡</span>-{product.discount}%
                                                    </Badge>
                                                </div>

                                                {/* Stock Alert */}
                                                {product.stock <= 10 && (
                                                    <div className="absolute top-1 md:top-2 right-1 md:right-2">
                                                        <Badge className="bg-orange-500 text-white font-semibold text-xs px-1.5 md:px-2 py-0.5">
                                                            {product.stock} left
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Compact Product Info */}
                                            <div className="p-2 md:p-3">
                                                <h3 className="text-xs md:text-sm font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-red-600 transition-colors">
                                                    {product.name}
                                                </h3>

                                                {/* Rating */}
                                                <div className="flex items-center gap-1 mb-2">
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg
                                                                key={i}
                                                                className={`h-2.5 md:h-3 w-2.5 md:w-3 ${
                                                                    i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                                                }`}
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-gray-600">({product.reviews})</span>
                                                </div>

                                                {/* Compact Price */}
                                                <div className="mb-2">
                                                    <div className="flex flex-col gap-0.5 mb-1">
                                                        <div className="text-sm md:text-lg font-bold text-red-600">
                                                            {formatPrice(product.price)}
                                                        </div>
                                                        <div className="text-xs text-gray-500 line-through">
                                                            {formatPrice(product.originalPrice)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Compact Sales Progress */}
                                                <div className="mb-2 md:mb-3">
                                                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                                        <span>{product.soldCount} sold</span>
                                                        <span>{Math.round(soldPercentage)}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-1 md:h-1.5">
                                                        <div
                                                            className="bg-gradient-to-r from-red-400 to-pink-500 h-1 md:h-1.5 rounded-full transition-all duration-300"
                                                            style={{ width: `${Math.min(soldPercentage, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {/* Compact Action Button */}
                                                <Button className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-1 md:py-1.5 text-xs md:text-sm shadow-lg hover:shadow-xl transition-all duration-300">
                                                    <svg className="h-2.5 md:h-3 w-2.5 md:w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L12 21l2.5-3H7z" />
                                                    </svg>
                                                    Add to Cart
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>

                    {/* View All Flash Sale Button */}
                    <div className="text-center mt-4">
                        <Button
                            size="sm"
                            className="bg-white text-red-600 hover:bg-gray-100 px-4 md:px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                        >
                            View All Flash Sale Items
                            <svg className="ml-2 h-3 md:h-4 w-3 md:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlashSaleSection;