import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Label } from '@/Components/ui/Label';

export function LoginForm({ 
    onSuccess, 
    onError, 
    submitButtonText = 'Sign In',
    showForgotPassword = true,
    showRememberMe = true,
    className = ''
}) {
    const [showPassword, setShowPassword] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post(route('login'), {
            onSuccess: () => {
                reset();
                if (onSuccess) onSuccess();
            },
            onError: () => {
                if (onError) onError();
            },
            preserveScroll: true,
        });
    };

    const handleInputChange = (field, value) => {
        setData(field, value);
    };

    return (
        <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
            {/* Email Field */}
            <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                </Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={data.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`pl-10 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                        disabled={processing}
                        autoComplete="username"
                    />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                </Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={data.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`pl-10 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                        disabled={processing}
                        autoComplete="current-password"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                        disabled={processing}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                        )}
                    </Button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* Remember Me and Forgot Password */}
            {(showRememberMe || showForgotPassword) && (
                <div className="flex items-center justify-between">
                    {showRememberMe && (
                        <div className="flex items-center">
                            <input
                                id="remember"
                                name="remember"
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => handleInputChange('remember', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                disabled={processing}
                            />
                            <Label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                                Remember me
                            </Label>
                        </div>
                    )}
                    {showForgotPassword && (
                        <Button 
                            variant="link" 
                            className="text-sm text-blue-600 hover:text-blue-700 p-0 h-auto"
                            onClick={() => window.location.href = route('password.request')}
                            type="button"
                        >
                            Forgot your password?
                        </Button>
                    )}
                </div>
            )}

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200"
                disabled={processing}
            >
                {processing ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Signing In...
                    </div>
                ) : (
                    submitButtonText
                )}
            </Button>
        </form>
    );
}