import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/HomePage/Home";
import AboutUs from './components/HomePage/AboutUs';
import Login from "./components/HomePage/Login";
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
    }
  ])

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
