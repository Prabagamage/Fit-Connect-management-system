import React, { useContext, useEffect } from "react";
import { createContext, useState } from "react";

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false)
    const [user, setUser] = useState({})

    useEffect(() => {
        if (user && user?._id) {
            sessionStorage.setItem('user', JSON.stringify(user))
        } else {
            const user = JSON.parse(sessionStorage.getItem('user'))
            if (user && user?._id) setUser(user)
        }
    }, [user])

    return (
        <AuthContext.Provider value={{ isAuth, setIsAuth, user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    return useContext(AuthContext)
}

export { AuthContext, AuthProvider, useAuth }