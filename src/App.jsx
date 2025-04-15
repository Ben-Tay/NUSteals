import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/HomePage/Home";
import AboutUs from "./components/HomePage/AboutUs";
import Login from "./components/HomePage/Login";
import CreateAccount from "./components/HomePage/CreateAccount";
import ForgotPassword from "./components/HomePage/ForgotPassword";
import Merchant from "./components/Merchant/Merchant";
import Student from "./components/Student/Student";
import ManageCoupon from "./components/Merchant/ManageCoupon/ManageCoupon";
import AddCoupon from "./components/Merchant/ManageCoupon/AddCoupon";
import MerchantDashboard from "./components/Merchant/MerchantDashboard";
import MerchantFaqs from "./components/Merchant/MerchantFaqs";
import MerchantProfile from "./components/Merchant/MerchantProfile";
import StudentCoupon from "./components/Student/ManageCoupon/StudentCoupon";
import StudentCouponHistory from "./components/Student/ManageCoupon/StudentCouponHistory";
import Admin from "./components/Admin/Admin";
import AdminDashboardTab from "./components/Admin/AdminDashboardMgt/AdminDashboardTab";
import AdminCouponMgt from "./components/Admin/AdminManageCoupon/AdminCouponMgt";
import AdminUserMgt from "./components/Admin/AdminUserMgt";
import StudentFaqs from "./components/Student/StudentFaqs";
import StudentProfile from "./components/Student/StudentProfile";
import AdminAddCoupon from "./components/Admin/AdminManageCoupon/AdminAddCoupon";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      // can add children if need be
    },
    {
      path: "/aboutUs",
      element: <AboutUs />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/create",
      element: <CreateAccount />,
    },
    {
      path: "/forgetpassword",
      element: <ForgotPassword />,
    },

    // Merchant routes
    {
      path: "/merchantLogin",
      element: <Merchant />,
      children: [
            {
                index: true,
                element: <MerchantDashboard />
            },
            {
              path: "manageCoupons",
              element: <ManageCoupon />,
            },
            {
              path: "addCoupon",
              element: <AddCoupon />
            },
          
            {
              path: "merchantFaqs",
              element: <MerchantFaqs />,
            },
            {
              path: "merchantProfile",
              element: <MerchantProfile />,
            },
        ]
    },


    // Student routes
    {
      path: "/studentLogin",
      element: <Student />,
      children: [
        {
          index: true,
          element: <StudentCoupon />,
        },
        {
          path: "studentCoupon", // Viewing all coupons
          element: <StudentCoupon />,
        },
        {
          path: "studentCoupon/history", // Viewing coupon history
          element: <StudentCouponHistory />,
        },
        {
          path: "faq", // FAQs
          element: <StudentFaqs />,
        },
        {
          path: "profile", // Profile page
          element: <StudentProfile />,
        },
      ],
    },

    // Admin routes
    {
      path: "/adminLogin",
      element: <Admin />,
      children: [
        {
          index: true, // the first one that is shown when go to adminLogin
          element: <AdminDashboardTab />,
        },
        {
          path: "adminManageCoupon",
          element: <AdminCouponMgt />,
        },
        //edit this to be the editing page route
        {
          path: "adminAddCoupons",
          element: <AdminAddCoupon />,
        },
        {
          path: "adminManageUsers",
          element: <AdminUserMgt />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
