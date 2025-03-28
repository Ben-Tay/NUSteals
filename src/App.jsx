import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/HomePage/Home";
import AboutUs from './components/HomePage/AboutUs';
import Login from "./components/HomePage/Login";
import CreateAccount from './components/HomePage/CreateAccount';
import ForgotPassword from './components/HomePage/ForgotPassword';
import Merchant from "./components/Merchant/Merchant";
import Student from "./components/Student/Student";
import ManageCoupon from "./components/Merchant/ManageCoupon/ManageCoupon";
import MerchantDashboard from "./components/Merchant/MerchantDashboard";
import MerchantFaqs from "./components/Merchant/MerchantFaqs";
import MerchantProfile from "./components/Merchant/MerchantProfile";
import StudentCoupon from './components/Student/ManageCoupon/StudentCoupon';
import StudentCouponHistory from './components/Student/ManageCoupon/StudentCouponHistory';
import Admin from './components/Admin/Admin';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminCouponMgt from './components/Admin/AdminCouponMgt';
import AdminUserMgt from './components/Admin/AdminUserMgt';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>
      // can add children if need be
    },
    {
      path: "/aboutUs",
      element: <AboutUs/>
    },
    {
      path: "/login",
      element: <Login/>
    },
    {
      path: "/create",
      element: <CreateAccount/>
    },
    {
      path: "/forgetpassword",
      element: <ForgotPassword/>
    },
    {
      path: "/merchantLogin",
      element: <Merchant/>
      // can add children if need be
    },
    {
      path: "/manageCoupons",
      element: <ManageCoupon/>
    },
    {
      path: "/merchantDashboard",
      element: <MerchantDashboard/>
    },
    {
      path: "/merchantFaqs",
      element: <MerchantFaqs/>
    },
    {
      path: "/merchantProfile",
      element: <MerchantProfile/>
    },
    {
      path: "/studentLogin",
      element: <Student/>
      // can add children if need be
    },
    {
    path: "/studentCoupon",
    element: <StudentCoupon/>
    },
    {
      path: "/studentCoupon/history",
      element: <StudentCouponHistory/>
    },
    {
      path: "/adminLogin",
      element: <Admin/>,
      children: [
          {
            index: true, // the first one that is shown when go to adminLogin
            element: <AdminDashboard/>
          },
          {
            path: 'adminManageCoupon',
            element: <AdminCouponMgt/>
          },
          {
            path: 'adminManageUsers',
            element: <AdminUserMgt/>
          }
      ]
    }
  ]);

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
