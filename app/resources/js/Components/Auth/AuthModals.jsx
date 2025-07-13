import React from 'react';
import { LoginModal } from './LoginModal';
import { RegisterModal } from './RegisterModal';

export function AuthModals({ isLoginOpen, isRegisterOpen, onClose, onSwitchToLogin, onSwitchToRegister }) {
    const handleClose = () => {
        onClose();
    };

    const handleSwitchToRegister = () => {
        onSwitchToRegister();
    };

    const handleSwitchToLogin = () => {
        onSwitchToLogin();
    };

    return (
        <>
            <LoginModal
                isOpen={isLoginOpen}
                onClose={handleClose}
                onSwitchToRegister={handleSwitchToRegister}
            />
            <RegisterModal
                isOpen={isRegisterOpen}
                onClose={handleClose}
                onSwitchToLogin={handleSwitchToLogin}
            />
        </>
    );
}