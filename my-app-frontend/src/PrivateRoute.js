import React from 'react';
import { Navigate } from 'react-router-dom'; // For redirection
import { useSelector } from 'react-redux'; // To access the Redux state

const PrivateRoute = ({children}) => {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    console.log("isLoggedIn: ", isLoggedIn);

    if (!isLoggedIn){
        
        return ( <Navigate to="/" />);
    }

    else{

        return children;
    }
}

export default PrivateRoute;