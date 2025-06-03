// src/hooks/useUser.ts
import { useState, useEffect } from "react";
import axios from "axios";

const useUser = () => {
    const [userType, setUserType] = useState<number | null>(null);
    const [loading, setLoading] = useState(true); // Novo estado

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const response = await axios.get("https://barbergo-api.onrender.com/api/AppUser/profile", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setUserType(response.data.type);
                }
            } catch (error) {
                console.error("Erro ao buscar dados do usuário", error);
            } finally {
                setLoading(false); // Finaliza o loading mesmo se der erro
            }
        };

        fetchUserData();
    }, []);

    return { userType, loading }; // Retorna loading
};

export default useUser;
