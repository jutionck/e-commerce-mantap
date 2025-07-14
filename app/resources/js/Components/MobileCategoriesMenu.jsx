import React, { useState } from 'react';
import { Grid3X3, X, ChevronRight } from 'lucide-react';

export default function MobileCategoriesMenu({ categories = [], onCategorySelect, selectedCategory }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleCategoryClick = (categoryId) => {
        setIsOpen(false);
        onCategorySelect(categoryId);
    };

    const handleAllCategoriesClick = () => {
        setIsOpen(false);
        onCategorySelect('all');
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden flex items-center gap-2 px-3 py-2 rounded-lg border border-orange-300 bg-orange-50 hover:bg-orange-100 transition-colors"
            >
                <Grid3X3 className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">Kategori</span>
            </button>

            {/* Mobile Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Slide-up Panel */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800">Pilih Kategori</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Categories List */}
                        <div className="p-4 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-2">
                                {/* All Categories */}
                                <button
                                    onClick={handleAllCategoriesClick}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                                        selectedCategory === 'all' 
                                            ? 'bg-orange-100 text-orange-800' 
                                            : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Grid3X3 className="w-5 h-5" />
                                        <span className="font-medium">Semua Kategori</span>
                                    </div>
                                    {selectedCategory === 'all' && (
                                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                                    )}
                                </button>

                                {/* Dynamic Categories */}
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryClick(category.id.toString())}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                                            selectedCategory === category.id.toString()
                                                ? 'bg-orange-100 text-orange-800' 
                                                : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <span className="text-xs font-medium text-gray-600">
                                                    {category.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="font-medium">{category.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {selectedCategory === category.id.toString() && (
                                                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                                            )}
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Safe Area */}
                        <div className="h-safe-area-inset-bottom bg-white" />
                    </div>
                </div>
            )}
        </>
    );
}