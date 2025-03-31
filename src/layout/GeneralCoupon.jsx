import React from 'react';

const Coupon = ({ brandLogo, brandName, discount, descriptionHeader, description, children }) => {
    // Split discount into 2 parts so they can be stacked
    const [discountTop, discountBottom] = discount ? discount.split(' ') : ['0%', 'off'];
    
    return (
        <div className="flex border border-gray-300 rounded-lg overflow-hidden ">
            {/* Left side: Brand logo and name */}
            <div className="w-1/4 bg-gray-100 p-4 flex flex-col items-center l-full">
                <img src={brandLogo} alt={`${brandName} logo`} className="w-16 h-16 mb-2" />
                <span className="text-lg font-semibold">{brandName}</span>
            </div>

            {/* Middle: Eye-catching header */}
            <div className="flex-1 bg-gray-200 flex flex-col items-center justify-center"> 
                <span className="text-2xl font-bold text-warning">{"20% Off Coupon | Starbuck’s Rewards Program"}</span>
                <span className="text-2xl font-bold text-warning">{discountBottom}</span>
            </div>

            {/* Right side: Description */}
            <div className="w-1/4 bg-white p-4">
                <h3 className="text-lg font-semibold mb-2">{descriptionHeader}</h3>
                <p className="text-sm">{description}</p>
            </div>

        </div>
    );
};

export default Coupon;
