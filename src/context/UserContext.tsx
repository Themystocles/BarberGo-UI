import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface User {
    name: string;
    profilePictureUrl: string;
    type: number;
}

interface UserContextType {
    user: User | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
    logoutUser: () => void; // adicionada função de logout
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }
            const response = await axios.get("https://barbergo-api.onrender.com/api/AppUser/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUser({
                name: response.data.name,
                profilePictureUrl: response.data.profilePictureUrl,
                type: response.data.type,
            });
        } catch (error) {
            console.error("Erro ao buscar dados do usuário", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Função para limpar usuário e token no logout
    const logoutUser = () => {
        setUser(null);
        setLoading(false);
        localStorage.removeItem("token");
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, refreshUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext deve ser usado dentro de um UserProvider");
    }
    return context;
};
