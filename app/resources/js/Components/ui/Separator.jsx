import React from 'react';

const Separator = React.forwardRef(({ className = '', orientation = 'horizontal', ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={`shrink-0 bg-gray-200 ${
                orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]'
            } ${className}`}
            {...props}
        />
    );
});

Separator.displayName = 'Separator';

export { Separator };