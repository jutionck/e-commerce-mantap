import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Check, X } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Label } from '@/Components/ui/Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/Dialog';
import { Separator } from '@/Components/ui/Separator';
import { Checkbox } from '@/Components/ui/Checkbox';
import { TermsModal } from './TermsModal';

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
        newsletter: true,
    });

    const validatePassword = (password) => {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
        return requirements;
    };

    const passwordRequirements = validatePassword(data.password);
    const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post(route('register'), {
            onSuccess: () => {
                reset();
                onClose();
                // Page will reload automatically after successful registration
            },
            onError: () => {
                // Errors will be displayed via the errors object
            },
            preserveScroll: true,
        });
    };

    const handleInputChange = (field, value) => {
        setData(field, value);
    };

    const handleClose = () => {
        if (!processing) {
            reset();
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="absolute right-4 top-4 h-8 w-8 p-0 hover:bg-gray-100 rounded-full z-10"
                    disabled={processing}
                >
                    <X className="h-4 w-4" />
                </Button>

                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Create Account</DialogTitle>
                    <p className="text-gray-600 text-center">Join us and start shopping with exclusive benefits</p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter your full name"
                                value={data.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                                disabled={processing}
                                autoComplete="name"
                            />
                        </div>
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={data.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                                disabled={processing}
                                autoComplete="username"
                            />
                        </div>
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a password"
                                value={data.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                                disabled={processing}
                                autoComplete="new-password"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                                disabled={processing}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                    <Eye className="h-4 w-4 text-gray-400" />
                                )}
                            </Button>
                        </div>

                        {/* Password Requirements */}
                        {data.password && (
                            <div className="space-y-1 text-xs">
                                <div
                                    className={`flex items-center gap-1 ${passwordRequirements.length ? 'text-green-600' : 'text-gray-500'}`}
                                >
                                    <Check className={`h-3 w-3 ${passwordRequirements.length ? 'opacity-100' : 'opacity-30'}`} />
                                    At least 8 characters
                                </div>
                                <div
                                    className={`flex items-center gap-1 ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-500'}`}
                                >
                                    <Check className={`h-3 w-3 ${passwordRequirements.uppercase ? 'opacity-100' : 'opacity-30'}`} />
                                    One uppercase letter
                                </div>
                                <div
                                    className={`flex items-center gap-1 ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-500'}`}
                                >
                                    <Check className={`h-3 w-3 ${passwordRequirements.lowercase ? 'opacity-100' : 'opacity-30'}`} />
                                    One lowercase letter
                                </div>
                                <div
                                    className={`flex items-center gap-1 ${passwordRequirements.number ? 'text-green-600' : 'text-gray-500'}`}
                                >
                                    <Check className={`h-3 w-3 ${passwordRequirements.number ? 'opacity-100' : 'opacity-30'}`} />
                                    One number
                                </div>
                                <div
                                    className={`flex items-center gap-1 ${passwordRequirements.special ? 'text-green-600' : 'text-gray-500'}`}
                                >
                                    <Check className={`h-3 w-3 ${passwordRequirements.special ? 'opacity-100' : 'opacity-30'}`} />
                                    One special character
                                </div>
                            </div>
                        )}

                        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="password_confirmation"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                value={data.password_confirmation}
                                onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                                className={`pl-10 pr-10 ${errors.password_confirmation ? 'border-red-500' : ''}`}
                                disabled={processing}
                                autoComplete="new-password"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                                disabled={processing}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                    <Eye className="h-4 w-4 text-gray-400" />
                                )}
                            </Button>
                        </div>
                        {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation}</p>}
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="terms"
                                checked={data.terms}
                                onCheckedChange={() => {}} // Disabled - only clickable through modal
                                disabled={true}
                                className="mt-0.5 cursor-not-allowed"
                            />
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsTermsModalOpen(true);
                                }}
                                className={`text-left text-sm font-normal leading-relaxed ${errors.terms ? 'text-red-500' : 'text-gray-700'} hover:text-blue-600 underline decoration-dotted underline-offset-2`}
                                type="button"
                            >
                                I agree to the Terms of Service and Privacy Policy
                            </button>
                        </div>
                        {errors.terms && <div className="ml-7 mt-1"><p className="text-sm text-red-500">You must agree to the terms and conditions</p></div>}

                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="newsletter"
                                checked={data.newsletter}
                                onCheckedChange={(checked) => handleInputChange('newsletter', checked)}
                                disabled={processing}
                                className="mt-0.5"
                            />
                            <Label htmlFor="newsletter" className="text-sm font-normal leading-relaxed">
                                Subscribe to our newsletter for exclusive offers and updates
                            </Label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        disabled={processing}
                    >
                        {processing ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Creating Account...
                            </div>
                        ) : (
                            'Create Account'
                        )}
                    </Button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                    <Separator />
                    <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-500">
                        or
                    </span>
                </div>

                {/* Social Registration */}
                <div className="space-y-3">
                    <Button variant="outline" className="w-full bg-transparent opacity-60 cursor-not-allowed" disabled={true}>
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        <span>Sign up with Google</span>
                        <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Coming Soon</span>
                    </Button>

                    <Button variant="outline" className="w-full bg-transparent opacity-60 cursor-not-allowed" disabled={true}>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span>Sign up with Facebook</span>
                        <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Coming Soon</span>
                    </Button>
                </div>

                {/* Switch to Login */}
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Button
                            variant="link"
                            onClick={onSwitchToLogin}
                            className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium"
                            disabled={processing}
                            type="button"
                        >
                            Sign in here
                        </Button>
                    </p>
                </div>
            </DialogContent>

            {/* Terms Modal */}
            <TermsModal
                isOpen={isTermsModalOpen}
                onClose={() => setIsTermsModalOpen(false)}
                onAccept={() => {
                    handleInputChange('terms', true);
                    setIsTermsModalOpen(false);
                }}
            />
        </Dialog>
    );
}