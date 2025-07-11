import { createContext, useState, useEffect, ReactNode } from "react";

interface Customization {
    id: number;
    logoUrl: string;
    nomeSistema: string;
    corPrimaria: string;
    corSecundaria: string;
    backgroundUrl: string;
    backgroundColor: string;
    descricao: string;
}

interface CustomizationContextType {
    customization: Customization;
    loading: boolean;
}

export const CustomizationContext = createContext<CustomizationContextType>({
    customization: {
        id: 0,
        logoUrl: "",
        nomeSistema: "",
        corPrimaria: "",
        corSecundaria: "",
        backgroundUrl: "",
        backgroundColor: "",
        descricao: ""
    },
    loading: true,
});

interface ProviderProps {
    children: ReactNode;
}

export const CustomizationProvider = ({ children }: ProviderProps) => {
    const [customization, setCustomization] = useState<Customization>({
        id: 0,
        logoUrl: "",
        nomeSistema: "",
        corPrimaria: "",
        corSecundaria: "",
        backgroundUrl: "",
        backgroundColor: "",
        descricao: ""
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomization = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("https://barbergo-api.onrender.com/api/SystemCustomization", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    throw new Error(`Erro ao buscar customization: ${res.statusText}`);
                }
                const data = await res.json();
                const configData = data[0] || {};

                setCustomization({
                    id: configData.id || 0,
                    logoUrl: configData.logoUrl || "",
                    nomeSistema: configData.nomeSistema || "",
                    corPrimaria: configData.corPrimaria || "",
                    corSecundaria: configData.corSecundaria || "",
                    backgroundUrl: configData.backgroundUrl || "",
                    backgroundColor: configData.backgroundColor || "",
                    descricao: configData.descricao || ""
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomization();
    }, []);

    return (
        <CustomizationContext.Provider value={{ customization, loading }}>
            {children}
        </CustomizationContext.Provider>
    );
};
