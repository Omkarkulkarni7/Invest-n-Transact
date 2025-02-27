import { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchUser = async () => {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                try {
                    const response = await API.get("/user/user-dashboard", {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });
                    setUser({
                        userId: response.data.userId,
                        role: response.data.role,
                    });

                    console.log(response.data);
                    
                } catch (err) {
                    console.log(err);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);
    
    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);