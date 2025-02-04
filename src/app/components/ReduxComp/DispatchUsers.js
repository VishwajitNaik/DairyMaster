"use client";
import { useSelector } from "react-redux";

export default function DispatchUsers() {
    const userData = useSelector((state) => state.users);
    console.log(userData);
    return(
        <>
        <h1>user List</h1>
        <h1>{userData}</h1>
        </>
    )
    
}