import React from 'react'
import {Route, Navigate} from 'react-router-dom'


const ProtectedRoute = ({children}) => {
    if(!localStorage['admin']){
        alert("Please login");
        return <Navigate to='/' />
    }

    return children

    
}

export default ProtectedRoute;