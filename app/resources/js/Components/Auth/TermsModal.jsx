import React, { useState, useRef } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/Dialog';

export function TermsModal({ isOpen, onClose, onAccept }) {
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
    const scrollContainerRef = useRef(null);

    const handleScroll = (e) => {
        const element = e.target;
        const tolerance = 10; // pixels tolerance for "reaching bottom"
        
        if (element.scrollHeight - element.scrollTop <= element.clientHeight + tolerance) {
            setHasScrolledToBottom(true);
        }
    };

    const scrollToBottom = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    const handleAccept = () => {
        onAccept();
        onClose();
        setHasScrolledToBottom(false); // Reset for next time
    };

    const handleClose = () => {
        onClose();
        setHasScrolledToBottom(false); // Reset for next time
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-2xl max-h-[80vh]">
                {/* Close Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="absolute right-4 top-4 h-8 w-8 p-0 hover:bg-gray-100 rounded-full z-10"
                >
                    <X className="h-4 w-4" />
                </Button>

                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center pr-8">
                        Terms of Service & Privacy Policy
                    </DialogTitle>
                </DialogHeader>

                {/* Scrollable Content */}
                <div 
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="max-h-96 overflow-y-auto p-4 border rounded-lg bg-gray-50 text-sm leading-relaxed"
                >
                    <div className="space-y-6">
                        <section>
                            <h3 className="text-lg font-semibold mb-3 text-gray-900">Terms of Service</h3>
                            
                            <h4 className="font-medium mb-2">1. Acceptance of Terms</h4>
                            <p className="mb-4 text-gray-700">
                                By accessing and using this e-commerce platform, you accept and agree to be bound by the terms and provision of this agreement. 
                                If you do not agree to abide by the above, please do not use this service.
                            </p>

                            <h4 className="font-medium mb-2">2. Account Registration</h4>
                            <p className="mb-4 text-gray-700">
                                When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
                                You are responsible for safeguarding the password and for maintaining the security of your account.
                            </p>

                            <h4 className="font-medium mb-2">3. Product Information and Pricing</h4>
                            <p className="mb-4 text-gray-700">
                                We strive to provide accurate product descriptions and pricing information. However, we do not warrant that product descriptions 
                                or other content is accurate, complete, reliable, current, or error-free. Prices are subject to change without notice.
                            </p>

                            <h4 className="font-medium mb-2">4. Orders and Payment</h4>
                            <p className="mb-4 text-gray-700">
                                All orders are subject to availability and confirmation of the order price. We reserve the right to refuse any order. 
                                Payment must be received prior to the acceptance of any order.
                            </p>

                            <h4 className="font-medium mb-2">5. Shipping and Delivery</h4>
                            <p className="mb-4 text-gray-700">
                                We will arrange for shipment of products to you. Risk of loss and title for items purchased pass to you upon delivery to the carrier. 
                                Shipping and delivery dates are estimates only and cannot be guaranteed.
                            </p>

                            <h4 className="font-medium mb-2">6. Returns and Refunds</h4>
                            <p className="mb-4 text-gray-700">
                                We offer a 30-day return policy for most items. Products must be returned in original condition with all original packaging. 
                                Refunds will be processed within 7-10 business days after we receive the returned item.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold mb-3 text-gray-900">Privacy Policy</h3>
                            
                            <h4 className="font-medium mb-2">1. Information We Collect</h4>
                            <p className="mb-4 text-gray-700">
                                We collect information you provide directly to us, such as when you create an account, make a purchase, 
                                or contact us for support. This may include your name, email address, phone number, and payment information.
                            </p>

                            <h4 className="font-medium mb-2">2. How We Use Your Information</h4>
                            <p className="mb-4 text-gray-700">
                                We use the information we collect to process transactions, send you order confirmations, provide customer support, 
                                and communicate with you about products, services, and promotional offers.
                            </p>

                            <h4 className="font-medium mb-2">3. Information Sharing</h4>
                            <p className="mb-4 text-gray-700">
                                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
                                except as described in this policy or as required by law.
                            </p>

                            <h4 className="font-medium mb-2">4. Data Security</h4>
                            <p className="mb-4 text-gray-700">
                                We implement appropriate security measures to protect your personal information against unauthorized access, 
                                alteration, disclosure, or destruction.
                            </p>

                            <h4 className="font-medium mb-2">5. Cookies and Tracking</h4>
                            <p className="mb-4 text-gray-700">
                                We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, 
                                and understand where our visitors are coming from.
                            </p>

                            <h4 className="font-medium mb-2">6. Your Rights</h4>
                            <p className="mb-4 text-gray-700">
                                You have the right to access, update, or delete your personal information. You may also opt out of receiving 
                                promotional communications from us at any time.
                            </p>

                            <h4 className="font-medium mb-2">7. Contact Information</h4>
                            <p className="mb-4 text-gray-700">
                                If you have any questions about these Terms of Service or Privacy Policy, please contact us at 
                                support@store.com or through our customer service page.
                            </p>

                            <h4 className="font-medium mb-2">8. Changes to This Policy</h4>
                            <p className="mb-4 text-gray-700">
                                We reserve the right to update this Privacy Policy and Terms of Service at any time. We will notify you of any changes 
                                by posting the new policy on this page with an updated revision date.
                            </p>

                            <p className="text-sm text-gray-600 mt-6 pt-4 border-t">
                                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </section>
                    </div>
                </div>

                {/* Scroll Indicator (only show if not scrolled to bottom) */}
                {!hasScrolledToBottom && (
                    <div className="flex items-center justify-center py-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={scrollToBottom}
                            className="text-blue-600 hover:text-blue-700 gap-1"
                        >
                            <span className="text-xs">Scroll to read all terms</span>
                            <ChevronDown className="h-3 w-3 animate-bounce" />
                        </Button>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAccept}
                        disabled={!hasScrolledToBottom}
                        className={`flex-1 ${
                            hasScrolledToBottom 
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {hasScrolledToBottom ? 'I Agree' : 'Please read all terms first'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}