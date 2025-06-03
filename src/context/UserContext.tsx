import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

interface User {
    name: string;
    profilePictureUrl: string;
    userType: number;
}

interface UserContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    loading: true,
    error: null,
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Token não encontrado");

                const response = await axios.get("https://barbergo-api.onrender.com/api/AppUser/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUser(response.data);
                setError(null);
            } catch (err) {
                setError("Erro ao buscar dados do usuário");
                setUser(null);
            } finally {
                setLoading(false); // MUITO IMPORTANTE: seta loading false SEMPRE!
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};
