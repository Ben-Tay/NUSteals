import React from 'react';

const Coupon = ({ brandLogo, brandName, discount, descriptionHeader, description, children, coupon, onEditClick }) => {
    // Split discount into 2 parts so they can be stacked
    const [discountTop, discountBottom] = discount ? discount.split(' ') : ['0%', 'off'];

    {/* RIGHT SIDE OF COUPON */ }
    const renderButtons = () => {
        switch (children) {
            // MERCHANT COUPON
            case 'merchant':
                return (
                    <div className="flex flex-col gap-2">
                        <button className="px-10 py-2 bg-[#F88B2C] text-white border-none rounded text-center" onClick={() => onEditClick(coupon)}>Edit Coupon</button>

                        <a
                            href="#"
                            className="px-10 py-2 bg-white text-[#F32626] border-3 border-[#F32626] rounded cursor-not-allowed no-underline text-center"
                        >
                            Disabled
                        </a>

                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex w-full max-w-[1000px] border border-gray-300 rounded-lg overflow-hidden mb-3">

            {/* LEFT: Discount (10% width) */}
            <div className="basis-[10%] bg-gray-100 p-4 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-warning">{discountTop}</span>
                <span className="text-2xl font-bold text-warning">{discountBottom}%</span>
            </div>

            {/* MIDDLE: Description (60% width) */}
            <div className="basis-[60%] p-4 flex flex-col">
                <h3 className="text-lg font-semibold mb-2">{descriptionHeader}</h3>
                <p className="text-sm">{description}</p>
            </div>

            {/* RIGHT: Buttons + Info (30% width) */}
            <div className="basis-[30%] bg-white p-4 flex justify-end items-start">
                {renderButtons()}
            </div>

        </div>
    );
};

export default Coupon;
