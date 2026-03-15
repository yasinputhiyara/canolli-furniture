

import { Navigate } from "react-router-dom";

export default function AdminRoute({children}){

  const admin = localStorage.getItem("admin");

  if(!admin){
    return <Navigate to="/admin/login"/>
  }

  return children
}


