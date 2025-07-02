import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';

export default function ProductImageManager({ product }) {
    const [draggedImageId, setDraggedImageId] = useState(null);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        images: []
    });

    const handleImageUpload = (e) => {
        e.preventDefault();
        if (data.images.length > 0) {
            post(route('admin.products.images.store', product.id), {
                onSuccess: () => {
                    reset();
                    // Refresh the page to show new images
                    router.reload({ only: ['product'] });
                }
            });
        }
    };

    const handleDeleteImage = (imageId) => {
        if (confirm('Are you sure you want to delete this image?')) {
            router.delete(route('admin.products.images.destroy', imageId), {
                onSuccess: () => {
                    router.reload({ only: ['product'] });
                }
            });
        }
    };

    const handleSetPrimary = (imageId) => {
        router.patch(route('admin.products.images.setPrimary', imageId), {}, {
            onSuccess: () => {
                router.reload({ only: ['product'] });
            }
        });
    };

    const handleDragStart = (e, imageId) => {
        setDraggedImageId(imageId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, targetImageId) => {
        e.preventDefault();
        if (draggedImageId && draggedImageId !== targetImageId) {
            // Find the images and swap their sort orders
            const draggedImage = product.images.find(img => img.id === draggedImageId);
            const targetImage = product.images.find(img => img.id === targetImageId);
            
            if (draggedImage && targetImage) {
                const updatedImages = product.images.map(img => {
                    if (img.id === draggedImageId) {
                        return { ...img, sort_order: targetImage.sort_order };
                    } else if (img.id === targetImageId) {
                        return { ...img, sort_order: draggedImage.sort_order };
                    }
                    return img;
                });

                router.patch(route('admin.products.images.reorder', product.id), {
                    images: updatedImages.map(img => ({ id: img.id, sort_order: img.sort_order }))
                }, {
                    onSuccess: () => {
                        router.reload({ only: ['product'] });
                    }
                });
            }
        }
        setDraggedImageId(null);
    };

    return (
        <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Product Images</h3>
                <form onSubmit={handleImageUpload} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Images (Max 5 images, 2MB each)
                        </label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => setData('images', Array.from(e.target.files))}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {errors.images && (
                            <p className="mt-1 text-sm text-red-600">{errors.images}</p>
                        )}
                    </div>
                    
                    {data.images.length > 0 && (
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`px-4 py-2 rounded-lg text-white transition duration-200 ${
                                    processing
                                        ? 'bg-blue-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {processing ? 'Uploading...' : `Upload ${data.images.length} Image(s)`}
                            </button>
                        </div>
                    )}
                </form>
            </div>

            {/* Current Images */}
            {product.images && product.images.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Current Images ({product.images.length})
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Drag and drop to reorder. Click "Set as Primary" to make an image the main product image.
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {product.images
                            .sort((a, b) => a.sort_order - b.sort_order)
                            .map((image) => (
                            <div
                                key={image.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, image.id)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, image.id)}
                                className={`relative group cursor-move border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                                    image.is_primary 
                                        ? 'border-green-500 shadow-lg' 
                                        : 'border-gray-200 hover:border-blue-300'
                                }`}
                            >
                                <div className="aspect-square bg-gray-100">
                                    <img
                                        src={image.image_url}
                                        alt={image.alt_text}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                
                                {/* Primary Badge */}
                                {image.is_primary && (
                                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                        Primary
                                    </div>
                                )}
                                
                                {/* Action Buttons */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="flex space-x-2">
                                        {!image.is_primary && (
                                            <button
                                                onClick={() => handleSetPrimary(image.id)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition duration-200"
                                            >
                                                Set Primary
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteImage(image.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition duration-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Sort Order */}
                                <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 text-gray-700 text-xs px-2 py-1 rounded font-medium">
                                    #{image.sort_order + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {(!product.images || product.images.length === 0) && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Images Uploaded</h3>
                    <p className="text-gray-600">Upload some images to showcase your product.</p>
                </div>
            )}
        </div>
    );
}