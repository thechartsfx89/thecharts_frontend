import React from 'react';

// Full-screen loader: a light track ring with a spinning brand-navy arc
const Loading = () => {
    return (
        <div className="screen_loader animate__animated fixed inset-0 z-[60] grid place-content-center bg-white dark:bg-[#060818]" role="status" aria-label="Loading">
            <svg className="h-12 w-12 animate-spin" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="3" className="text-gray-200 dark:text-white/10" />
                <path d="M24 3a21 21 0 0 1 21 21" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-[#0b1b33] dark:text-white" />
            </svg>
        </div>
    );
};

export default Loading;
