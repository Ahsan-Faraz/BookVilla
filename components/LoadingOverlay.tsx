'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingOverlay = () => {
    return (
        <div className="loading-wrapper">
            <div className="loading-shadow-wrapper bg-[#222244] shadow-soft-lg">
                <div className="loading-shadow">
                    <Loader2 className="loading-animation w-12 h-12 text-[#d4770b]" />
                    <h2 className="loading-title">Synthesizing Your Book</h2>
                    <p className="text-[#8a7e6b] text-center max-w-xs">
                        Please wait while we process your PDF and prepare your interactive literary experience.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoadingOverlay;
