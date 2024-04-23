

import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

// Protected Route: firebase에게 로그인한 사용자가 누구인지 물어보는 route
export default function ProtectedRoute({children,}: {
    children: React.ReactNode; })
     {

    const user = auth.currentUser;
    
    console.log(user);
    //로그인을 안했으면 login창으로 이동 
    if(user === null){
        return <Navigate to ="/login"/>
    }

    //로그인 했으면 
    return children;
}