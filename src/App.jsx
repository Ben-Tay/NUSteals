import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/HomePage/Home";
import AboutUs from './components/HomePage/AboutUs';
import Login from "./components/HomePage/Login";
import Merchant from "./components/Merchant/Merchant";
import Student from "./components/Student/Student";
import ManageCoupon from "./components/Merchant/ManageCoupon";
import MerchantDashboard from "./components/Merchant/MerchantDashboard";
import MerchantFaqs from "./components/Merchant/MerchantFaqs";
import MerchantProfile from "./components/Merchant/MerchantProfile";
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
    }

  ]);

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
