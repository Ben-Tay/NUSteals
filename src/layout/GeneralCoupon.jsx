import React from 'react';

const Coupon = ({ brandLogo, brandName, discount, descriptionHeader, description, children }) => {
    // Split discount into 2 parts so they can be stacked
    const [discountTop, discountBottom] = discount.split(' ');
    
    return (
        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            {/* Left side: Brand logo and name */}
            <div className="w-1/4 bg-gray-100 p-4 flex flex-col items-center">
                <img src={brandLogo} alt={`${brandName} logo`} className="w-16 h-16 mb-2" />
                <span className="text-lg font-semibold">{brandName}</span>
            </div>

            {/* Middle: Eye-catching header */}
            <div className="w-1/6 bg-gray-200 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-warning">{discountTop}</span>
                <span className="text-2xl font-bold text-warning">{discountBottom}</span>
            </div>

            {/* Right side: Description */}
            <div className="w-1/4 bg-white p-4">
                <h3 className="text-lg font-semibold mb-2">{descriptionHeader}</h3>
                <p className="text-sm">{description}</p>
            </div>

            {/* Extreme right: Custom component */}
            <div className="w-1/4 bg-white p-4 flex items-center justify-center">
                {children}
            </div>
        </div>
    );
};

export default Coupon;