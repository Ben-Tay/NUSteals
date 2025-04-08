import React from 'react';

const Coupon = ({ brandLogo, brandName, discount, descriptionHeader, description, children, coupon, onEditClick, disable, onToggleClick }) => {
    const [discountTop, discountBottom] = discount ? discount.split(' ') : ['0%', 'off'];

    const isDisabled = coupon?.disable;
    console.log('isDisabled:', isDisabled);
    const renderButtons = () => {
        switch (children) {
            case 'merchant':
                return (
                    <div className="flex flex-col gap-2">
                        {isDisabled ? (
                            <button
                                className="px-10 py-2 bg-white text-[#F32626] border border-[#F32626] rounded text-center"
                                onClick={() => onToggleClick(coupon)}
                            >
                                Enable
                            </button>
                        ) : (
                            <button
                                className="px-10 py-2 bg-[#F88B2C] text-white border-none rounded text-center"
                                onClick={() => onEditClick(coupon)}
                            >
                                View Coupon
                            </button>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };
    return (
        <div
            className={`flex w-full max-w-[1000px] border rounded-lg overflow-hidden ${isDisabled ? 'bg-[#F32626] text-white border-[#F32626]' : 'border-gray-300 bg-white text-black'
                }`}
        >
            {/* LEFT: Discount (10% width) */}
            <div
                className={`basis-[10%] p-4 flex flex-col items-center justify-center ${isDisabled ? 'bg-[#F32626]' : 'bg-gray-100'
                    }`}
            >
                <span className={`text-2xl font-bold ${isDisabled ? 'text-white' : 'text-warning'}`}>{discountTop}</span>
                <span className={`text-2xl font-bold ${isDisabled ? 'text-white' : 'text-warning'}`}>{discountBottom}</span>
            </div>

            {/* MIDDLE: Description (60% width) */}
            <div className="basis-[60%] p-4 flex flex-col">
                <h3 className="text-lg font-semibold mb-2">{descriptionHeader}</h3>
                <p className="text-sm">{description}</p>
            </div>

            {/* RIGHT: Buttons + Info (30% width) */}
            <div className="basis-[30%] p-4 flex justify-end items-start">
                {renderButtons()}
            </div>
        </div>
    );
};

export default Coupon;