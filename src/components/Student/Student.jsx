import React from "react";
import { Outlet } from "react-router-dom";
import GeneralNavBar from "../../layout/GeneralNavBar";

const Student = () => {
  return (
    <>
      <GeneralNavBar userRole="student" />
      <Outlet />
    </>
  );
};

export default Student;
