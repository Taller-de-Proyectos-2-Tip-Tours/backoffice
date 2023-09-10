import { useState, useEffect } from "react";
import CookieService from "../CookieService";
import {useNavigate} from 'react-router-dom';

export const LoggedInState = () => {
    const navigate = useNavigate();
    const [loggedIn,setLoggedIn] = useState(true)
    useEffect(()=>{
        updateLoginState();
    },[navigate.length])

    const updateLoginState = () => {
        const isLogged =  CookieService.isLogIn();
        setLoggedIn(isLogged);
    }

    const goToHome = () => {
        if(!loggedIn) {
            navigate(-1,{replace:true})
        }
    }

    return {
        loggedIn,
        updateLoginState,
        goToHome
    }
}