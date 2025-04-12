import React from "react";
import { NavLink } from "react-router-dom";

const StudentCouponNavbar = () => {
  return (
    <div className="bg-white pt-2 px-4 pb-4">
      <div className="flex justify-center">
        {/* Link for All Coupons */}
        <NavLink
          to="/studentLogin/studentCoupon"
          end
          className={({ isActive }) =>
            `px-4 py-2 mx-2 ${isActive ? "text-orange-500" : "text-black"}`
          }
        >
          All Coupons
        </NavLink>

        {/* Link for View My History */}
        <NavLink
          to="/studentLogin/studentCoupon/history"
          end
          className={({ isActive }) =>
            `px-4 py-2 mx-2 ${isActive ? "text-orange-500" : "text-black"}`
          }
        >
          View My History
        </NavLink>
      </div>
    </div>
  );
};

export default StudentCouponNavbar;
