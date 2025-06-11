import { useState } from "react";
import api from "../services/api";
import { User } from "../interfaces/User";

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const login = async (email: string, password: string): Promise<boolean> => {
        setError("");
        setSuccessMessage("");
        try {
            const response = await api.post("/login", { Email: email, Password: password }).catch((err) => {
                throw err;
            });

            if (response.data && response.data.token) {
                const { token } = response.data;
                localStorage.setItem("token", token);
                api.defaults.headers.Authorization = `Bearer ${token}`;
                setUser({ email });
                setError(null);
                setSuccessMessage("Login bem-sucedido! Redirecionando...");
                return true;
            }
            return false;
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                setError("Credenciais inválidas. Verifique seu e-mail e senha.");
            } else if (error.response && error.response.status === 401) {
                setError("Não autorizado. Verifique as credenciais.");
            } else {
                setError("Erro ao fazer login. Tente novamente.");
            }
            console.error("Erro ao fazer login:", error.response?.data || error.message);
            setUser(null);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        delete api.defaults.headers.Authorization;
        setUser(null);
    };

    return { user, login, logout, error, successMessage };
};
