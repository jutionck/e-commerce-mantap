import React, { useState, useEffect } from 'react';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';

const carouselSlides = [
    {
        id: 1,
        title: "Summer Sale",
        subtitle: "Up to 70% Off",
        description: "Discover amazing deals on fashion, electronics, and more",
        image: "/images/product_placeholder.svg",
        buttonText: "Shop Now",
        buttonLink: "#",
        bgGradient: "from-pink-500 to-rose-500",
    },
    {
        id: 2,
        title: "New Arrivals",
        subtitle: "Fresh & Trendy",
        description: "Check out the latest products just added to our collection",
        image: "/images/product_placeholder.svg",
        buttonText: "Explore",
        buttonLink: "#",
        bgGradient: "from-blue-500 to-purple-500",
    },
    {
        id: 3,
        title: "Electronics Deal",
        subtitle: "Tech at Best Prices",
        description: "Premium smartphones, laptops, and gadgets with warranty",
        image: "/images/product_placeholder.svg",
        buttonText: "View Deals",
        buttonLink: "#",
        bgGradient: "from-green-500 to-teal-500",
    },
    {
        id: 4,
        title: "Beauty & Care",
        subtitle: "Glow Up Collection",
        description: "Premium skincare and beauty products for your daily routine",
        image: "/images/product_placeholder.svg",
        buttonText: "Discover",
        buttonLink: "#",
        bgGradient: "from-purple-500 to-indigo-500",
    },
];

const Carousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-play carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    };

    return (
        <div className="relative h-[600px] overflow-hidden">
            {/* Slides */}
            <div
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {carouselSlides.map((slide) => (
                    <div
                        key={slide.id}
                        className={`min-w-full h-full bg-gradient-to-r ${slide.bgGradient} relative flex items-center`}
                    >
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>

                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover opacity-30"
                            />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                            <div className="max-w-2xl">
                                <div className="mb-4">
                                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                                        {slide.subtitle}
                                    </Badge>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
                                    {slide.title}
                                </h1>
                                <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
                                    {slide.description}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button
                                        size="lg"
                                        className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        {slide.buttonText}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold bg-transparent backdrop-blur-sm transition-all duration-300"
                                    >
                                        Learn More
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <Button
                variant="ghost"
                size="sm"
                onClick={prevSlide}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full p-4 transition-all duration-300 hover:scale-110"
            >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={nextSlide}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full p-4 transition-all duration-300 hover:scale-110"
            >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </Button>

            {/* Dots Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
                {carouselSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-4 h-4 rounded-full transition-all duration-300 ${
                            index === currentSlide ? "bg-white scale-125 shadow-lg" : "bg-white/50 hover:bg-white/75"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;