import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { LoginForm } from '@/Components/Auth/LoginForm';

export default function Login({ status, canResetPassword }) {

    return (
        <GuestLayout>
            <Head title="Sign In" />

            <div className="min-h-screen flex">
                {/* Left Side - Information/Visual */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
                            <defs>
                                <pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse">
                                    <circle cx="2" cy="2" r="1" />
                                </pattern>
                            </defs>
                            <rect width="100" height="100" fill="url(#grid)" />
                        </svg>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-center px-12 py-16">
                        <div className="max-w-md">
                            {/* Logo/Icon */}
                            <div className="flex items-center mb-8">
                                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18l-1 13H4L3 3Z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 16a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 16a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"/>
                                    </svg>
                                </div>
                                <span className="ml-3 text-2xl font-bold text-white">E-Commerce Mantap</span>
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
                                Welcome Back to Your Shopping Paradise
                            </h1>
                            
                            {/* Description */}
                            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                                Discover amazing products, enjoy seamless shopping experience, and get your favorite items delivered right to your doorstep.
                            </p>

                            {/* Features */}
                            <div className="space-y-4">
                                <div className="flex items-center text-white">
                                    <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span>Secure Payment Gateway</span>
                                </div>
                                <div className="flex items-center text-white">
                                    <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span>Fast & Reliable Shipping</span>
                                </div>
                                <div className="flex items-center text-white">
                                    <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span>24/7 Customer Support</span>
                                </div>
                            </div>

                            {/* Statistics */}
                            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white border-opacity-20">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">10K+</div>
                                    <div className="text-sm text-blue-100">Happy Customers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">5K+</div>
                                    <div className="text-sm text-blue-100">Products</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">99%</div>
                                    <div className="text-sm text-blue-100">Satisfaction</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-10 right-10 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-20 right-20 w-32 h-32 bg-white bg-opacity-5 rounded-full blur-2xl"></div>
                    <div className="absolute top-1/2 right-0 w-40 h-40 bg-white bg-opacity-5 rounded-full blur-3xl transform translate-x-1/2"></div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full space-y-8">
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18l-1 13H4L3 3Z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 16a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 16a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"/>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">E-Commerce Mantap</h2>
                        </div>

                        {/* Header */}
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl font-extrabold text-gray-900">
                                Welcome Back
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Sign in to your account to continue shopping
                            </p>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-green-800">
                                            {status}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Login Form Card */}
                        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
                            <LoginForm 
                                submitButtonText="Sign In"
                                showForgotPassword={canResetPassword}
                                showRememberMe={true}
                            />

                            {/* Divider */}
                            <div className="mt-8 mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white text-gray-500">New to our platform?</span>
                                    </div>
                                </div>
                            </div>

                            {/* Register Link */}
                            <div className="text-center">
                                <Link 
                                    href={route('register')} 
                                    className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                >
                                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    Create New Account
                                </Link>
                            </div>
                        </div>

                        {/* Mobile Features */}
                        <div className="lg:hidden">
                            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-gray-900">10K+</div>
                                    <div className="text-xs text-gray-500">Customers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-gray-900">5K+</div>
                                    <div className="text-xs text-gray-500">Products</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-gray-900">99%</div>
                                    <div className="text-xs text-gray-500">Satisfaction</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
