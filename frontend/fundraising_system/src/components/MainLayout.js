import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import Navbar from "./ui/NavBar";
import { Outlet } from "react-router-dom";

const MainLayout = ({ children }) => {
  
  return (
    <>
      <Navbar  /> 
      <div className="content">
        <Outlet />
      </div>
     
    </>
  );
};

export default MainLayout;
