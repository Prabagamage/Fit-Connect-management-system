import React from "react";
import { createContext, useState } from "react";

const AuthContext = createContext()

const AuthProvider = ({children}) => {
    const [isAuth, setIsAuth] = useState(false)
    const [user, setUser] = useState({})

    return (
        <AuthContext.Provider value={{isAuth, setIsAuth, user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    return useContext(AuthContext)
}

export { AuthContext, AuthProvider, useAuth }