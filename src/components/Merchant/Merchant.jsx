import React from 'react'
import GeneralNavBar from '../../layout/GeneralNavBar'
import { Outlet } from 'react-router-dom'

const Merchant = () => {
  return (
    <>
        <GeneralNavBar userRole="merchant"/>
        <Outlet/>
    </>
  )
}

export default Merchant