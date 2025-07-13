import React from 'react';
import Modal from '@/Components/Modal';

const Dialog = ({ open, onOpenChange, children }) => {
    const handleClose = () => {
        if (onOpenChange && typeof onOpenChange === 'function') {
            onOpenChange(false);
        }
    };

    return (
        <Modal
            show={open}
            onClose={handleClose}
            maxWidth="md"
            closeable={true}
        >
            {children}
        </Modal>
    );
};

const DialogContent = ({ className = '', children, ...props }) => {
    return (
        <div className={`relative p-6 ${className}`} {...props}>
            {children}
        </div>
    );
};

const DialogHeader = ({ className = '', children, ...props }) => {
    return (
        <div className={`mb-6 ${className}`} {...props}>
            {children}
        </div>
    );
};

const DialogTitle = ({ className = '', children, ...props }) => {
    return (
        <h2 className={`text-xl font-semibold leading-6 text-gray-900 ${className}`} {...props}>
            {children}
        </h2>
    );
};

export { Dialog, DialogContent, DialogHeader, DialogTitle };