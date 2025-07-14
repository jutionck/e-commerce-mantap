import React, { useState } from 'react';
import { ChevronDown, Grid3X3, Package, Shirt, Car, Heart, Home, GamepadIcon, Book, Zap } from 'lucide-react';

export default function CategoriesDropdown({ categories = [], onCategorySelect, selectedCategory }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);

    // Auto select first category when dropdown opens
    const handleDropdownToggle = () => {
        const newIsOpen = !isOpen;
        setIsOpen(newIsOpen);
        
        if (newIsOpen && categories.length > 0 && !activeCategory) {
            setActiveCategory(categories[0]);
        }
        
        if (!newIsOpen) {
            setActiveCategory(null);
        }
    };

    // Mock subcategories data - in real app this would come from API
    const subcategoriesData = {
        'electronics': [
            { name: 'Smartphone', icon: <Zap className="w-5 h-5" /> },
            { name: 'Laptop & Komputer', icon: <Package className="w-5 h-5" /> },
            { name: 'Audio & Video', icon: <Package className="w-5 h-5" /> },
            { name: 'Gaming', icon: <GamepadIcon className="w-5 h-5" /> },
            { name: 'Aksesoris Elektronik', icon: <Package className="w-5 h-5" /> },
            { name: 'Kamera', icon: <Package className="w-5 h-5" /> },
        ],
        'fashion': [
            { name: 'Fashion Pria', icon: <Shirt className="w-5 h-5" /> },
            { name: 'Fashion Wanita', icon: <Shirt className="w-5 h-5" /> },
            { name: 'Tas & Dompet', icon: <Package className="w-5 h-5" /> },
            { name: 'Sepatu', icon: <Package className="w-5 h-5" /> },
            { name: 'Aksesoris Fashion', icon: <Package className="w-5 h-5" /> },
            { name: 'Jam Tangan', icon: <Package className="w-5 h-5" /> },
        ],
        'automotive': [
            { name: 'Mobil', icon: <Car className="w-5 h-5" /> },
            { name: 'Motor', icon: <Car className="w-5 h-5" /> },
            { name: 'Aksesoris Mobil', icon: <Package className="w-5 h-5" /> },
            { name: 'Aksesoris Motor', icon: <Package className="w-5 h-5" /> },
            { name: 'Spare Part', icon: <Package className="w-5 h-5" /> },
            { name: 'Oli & Maintenance', icon: <Package className="w-5 h-5" /> },
        ],
        'health': [
            { name: 'Kesehatan', icon: <Heart className="w-5 h-5" /> },
            { name: 'Kecantikan', icon: <Heart className="w-5 h-5" /> },
            { name: 'Perawatan Tubuh', icon: <Heart className="w-5 h-5" /> },
            { name: 'Vitamin & Suplemen', icon: <Heart className="w-5 h-5" /> },
            { name: 'Alat Kesehatan', icon: <Heart className="w-5 h-5" /> },
            { name: 'Skincare', icon: <Heart className="w-5 h-5" /> },
        ],
        'home': [
            { name: 'Furniture', icon: <Home className="w-5 h-5" /> },
            { name: 'Dekorasi Rumah', icon: <Home className="w-5 h-5" /> },
            { name: 'Peralatan Rumah', icon: <Home className="w-5 h-5" /> },
            { name: 'Elektronik Rumah', icon: <Zap className="w-5 h-5" /> },
            { name: 'Dapur', icon: <Package className="w-5 h-5" /> },
            { name: 'Kamar Tidur', icon: <Home className="w-5 h-5" /> },
        ],
        'books': [
            { name: 'Buku Fiksi', icon: <Book className="w-5 h-5" /> },
            { name: 'Buku Non-Fiksi', icon: <Book className="w-5 h-5" /> },
            { name: 'Buku Anak', icon: <Book className="w-5 h-5" /> },
            { name: 'Buku Pendidikan', icon: <Book className="w-5 h-5" /> },
            { name: 'Komik & Manga', icon: <Book className="w-5 h-5" /> },
            { name: 'Majalah', icon: <Book className="w-5 h-5" /> },
        ]
    };

    const getCategoryIcon = (categoryName) => {
        const name = categoryName.toLowerCase();
        if (name.includes('elektronik') || name.includes('gadget')) return <Zap className="w-5 h-5" />;
        if (name.includes('fashion') || name.includes('pakaian')) return <Shirt className="w-5 h-5" />;
        if (name.includes('otomotif') || name.includes('kendaraan')) return <Car className="w-5 h-5" />;
        if (name.includes('kesehatan') || name.includes('kecantikan')) return <Heart className="w-5 h-5" />;
        if (name.includes('rumah') || name.includes('furniture')) return <Home className="w-5 h-5" />;
        if (name.includes('buku') || name.includes('book')) return <Book className="w-5 h-5" />;
        if (name.includes('gaming') || name.includes('game')) return <GamepadIcon className="w-5 h-5" />;
        return <Package className="w-5 h-5" />;
    };

    const getSubcategories = (categoryName) => {
        const name = categoryName.toLowerCase();
        if (name.includes('elektronik') || name.includes('gadget')) return subcategoriesData.electronics;
        if (name.includes('fashion') || name.includes('pakaian')) return subcategoriesData.fashion;
        if (name.includes('otomotif') || name.includes('kendaraan')) return subcategoriesData.automotive;
        if (name.includes('kesehatan') || name.includes('kecantikan')) return subcategoriesData.health;
        if (name.includes('rumah') || name.includes('furniture')) return subcategoriesData.home;
        if (name.includes('buku') || name.includes('book')) return subcategoriesData.books;
        
        // Default subcategories
        return [
            { name: 'Sub Kategori 1', icon: <Package className="w-5 h-5" /> },
            { name: 'Sub Kategori 2', icon: <Package className="w-5 h-5" /> },
            { name: 'Sub Kategori 3', icon: <Package className="w-5 h-5" /> },
            { name: 'Sub Kategori 4', icon: <Package className="w-5 h-5" /> },
        ];
    };

    const handleCategoryHover = (category) => {
        setActiveCategory(category);
    };

    const handleCategoryClick = (categoryId) => {
        setIsOpen(false);
        onCategorySelect(categoryId);
    };

    const handleAllCategoriesClick = () => {
        setIsOpen(false);
        onCategorySelect('all');
    };

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                onClick={handleDropdownToggle}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-orange-300 bg-orange-50 hover:bg-orange-100 transition-colors"
            >
                <Grid3X3 className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">Semua Kategori</span>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-30"
                        onClick={() => {
                            setIsOpen(false);
                            setActiveCategory(null);
                        }}
                    />
                    
                    {/* Dropdown Content */}
                    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 w-screen max-w-7xl bg-white border border-gray-200 rounded-lg shadow-xl z-40 px-4">
                        <div className="flex min-h-[400px]">
                            {/* Left Panel - Categories */}
                            <div className="w-64 sm:w-72 lg:w-80 border-r border-gray-200 bg-gray-50 flex-shrink-0">
                                <div className="p-4">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Kategori</h3>
                                    <div className="space-y-1">
                                        {/* All Categories */}
                                        <button
                                            onClick={handleAllCategoriesClick}
                                            className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                                                selectedCategory === 'all' 
                                                    ? 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500' 
                                                    : 'hover:bg-gray-50 text-gray-700'
                                            }`}
                                        >
                                            <Grid3X3 className="w-5 h-5" />
                                            <span className="text-sm font-medium">Semua Kategori</span>
                                        </button>

                                        {/* Dynamic Categories */}
                                        {categories.map((category) => (
                                            <button
                                                key={category.id}
                                                onMouseEnter={() => handleCategoryHover(category)}
                                                onClick={() => handleCategoryClick(category.id.toString())}
                                                className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                                                    activeCategory?.id === category.id || selectedCategory === category.id.toString()
                                                        ? 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500' 
                                                        : 'hover:bg-gray-50 text-gray-700'
                                                }`}
                                            >
                                                {getCategoryIcon(category.name)}
                                                <span className="text-sm font-medium">{category.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel - Subcategories */}
                            <div className="flex-1 p-6 bg-white">
                                {activeCategory ? (
                                    <>
                                        <div className="flex items-center gap-2 mb-6">
                                            {getCategoryIcon(activeCategory.name)}
                                            <h3 className="text-lg font-semibold text-gray-800">{activeCategory.name}</h3>
                                            <ChevronDown className="w-5 h-5 text-gray-400 rotate-90" />
                                        </div>
                                        
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                            {getSubcategories(activeCategory.name).map((subcategory, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleCategoryClick(activeCategory.id.toString())}
                                                    className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors text-center"
                                                >
                                                    <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg">
                                                        {subcategory.icon}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800">{subcategory.name}</p>
                                                        <p className="text-xs text-gray-500 mt-1">Lihat produk</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        <div className="text-center">
                                            <Grid3X3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                            <h4 className="text-lg font-medium text-gray-700 mb-2">Pilih Kategori</h4>
                                            <p className="text-sm text-gray-500">Pilih kategori untuk melihat sub-kategori</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}