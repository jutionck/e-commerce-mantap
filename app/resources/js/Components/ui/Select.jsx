import React, { useState, useRef, useEffect } from 'react';

const Select = ({ value, onValueChange, children, ...props }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value);
    const selectRef = useRef(null);

    useEffect(() => {
        setSelectedValue(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (newValue) => {
        setSelectedValue(newValue);
        onValueChange(newValue);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={selectRef} {...props}>
            {React.Children.map(children, child =>
                React.cloneElement(child, {
                    isOpen,
                    setIsOpen,
                    selectedValue,
                    onSelect: handleSelect
                })
            )}
        </div>
    );
};

const SelectTrigger = ({ className = '', isOpen, setIsOpen, selectedValue, children, ...props }) => {
    const placeholder = React.Children.toArray(children).find(child => child.type === SelectValue);
    
    return (
        <button
            type="button"
            className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            onClick={() => setIsOpen(!isOpen)}
            {...props}
        >
            {placeholder}
            <svg
                className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>
    );
};

const SelectValue = ({ placeholder, selectedValue }) => {
    return <span>{selectedValue || placeholder}</span>;
};

const SelectContent = ({ className = '', isOpen, children, ...props }) => {
    if (!isOpen) return null;

    return (
        <div
            className={`absolute top-full left-0 z-50 w-full mt-1 rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

const SelectItem = ({ value, onSelect, className = '', children, ...props }) => {
    return (
        <div
            className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer ${className}`}
            onClick={() => onSelect(value)}
            {...props}
        >
            {children}
        </div>
    );
};

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };