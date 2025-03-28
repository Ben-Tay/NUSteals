import React from 'react'
import GeneralNavBar from '../../layout/GeneralNavBar'
import { Outlet } from 'react-router-dom'; // Import Outlet

const Admin = () => {
  return (
    <>
        <GeneralNavBar userRole="admin"/>
        <Outlet/>
    </>
  )
}

export default Admin