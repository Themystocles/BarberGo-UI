// src/hooks/useUser.ts
import { useState, useEffect } from "react";
import axios from "axios";

const useUser = () => {
    const [userType, setUserType] = useState<number | null>(null);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const response = await axios.get("https://localhost:7032/api/AppUser/profile", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setUserType(response.data.type);
                }
            } catch (error) {
                console.error("Erro ao buscar dados do usuário", error);
            }
        };

        fetchUserData();
    }, []);

    return { userType };
};

export default useUser;
