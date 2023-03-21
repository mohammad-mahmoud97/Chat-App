import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../library';

export default function Logout(){
    
    const navigate = useNavigate();
    
    useEffect(() => {
        console.log(JSON.parse(localStorage.getItem("currentUser")));
        fetchData("http://localhost:5078/logout", "GET", "application", `userID=${JSON.parse(localStorage.getItem("currentUser"))}`, null);
        localStorage.setItem("currentUser", 0);
        navigate("/login");
    })
}