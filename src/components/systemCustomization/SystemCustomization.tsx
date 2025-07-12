import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../header/Header";
import Footer from "../footer/Footer";

interface StyleConfig {
    id: number;
    logoUrl: string;
    nomeSistema: string;
    corPrimaria: string;
    corSecundaria: string;
    backgroundUrl: string;
    backgroundColor: string;
    descricao: string;
}

const SystemCustomization = () => {
    const [config, setConfig] = useState<StyleConfig>({
        id: 1,
        logoUrl: "",
        nomeSistema: "Barbearia",
        corPrimaria: "#2563eb",
        corSecundaria: "#6b7280",
        backgroundUrl: "",
        backgroundColor: "#ffffff",
        descricao: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    "https://barbergo-api.onrender.com/api/SystemCustomization/find/1",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setConfig({
                    id: response.data.id,
                    logoUrl: response.data.logoUrl || "",
                    nomeSistema: response.data.nomeSistema || "Barbearia",
                    corPrimaria: response.data.corPrimaria || "#2563eb",
                    corSecundaria: response.data.corSecundaria || "#6b7280",
                    backgroundUrl: response.data.backgroundUrl || "",
                    backgroundColor: response.data.backgroundColor || "#ffffff",
                    descricao: response.data.descricao || "",
                });
            } catch (error) {
                console.error("Erro ao carregar configurações", error);
                setMessage("Erro ao carregar configurações.");
            }
        };
        fetchConfig();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setConfig((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage("");
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                "https://barbergo-api.onrender.com/api/SystemCustomization/update/1",
                {
                    id: config.id,
                    logoUrl: config.logoUrl,
                    nomeSistema: config.nomeSistema,
                    corPrimaria: config.corPrimaria,
                    corSecundaria: config.corSecundaria,
                    backgroundUrl: config.backgroundUrl,
                    backgroundColor: config.backgroundColor,
                    descricao: config.descricao,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMessage("Configurações salvas com sucesso!");
        } catch (error: any) {
            console.error("Erro no PUT:", error.response || error.message);
            setMessage("Erro ao salvar configurações.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />

            <div className="max-w-3xl mx-auto p-6">
                <h2 className="text-2xl font-bold mb-6">Configurar Estilo</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Cor Primária - fundo header/footer */}
                    <div>
                        <label
                            htmlFor="corPrimaria"
                            className="block font-semibold mb-1"
                        >
                            Cor Primária (fundo do header/footer)
                        </label>
                        <input
                            type="color"
                            id="corPrimaria"
                            name="corPrimaria"
                            value={config.corPrimaria}
                            onChange={handleChange}
                            className="w-full h-10 cursor-pointer"
                        />
                    </div>

                    {/* Cor Secundária - texto do sistema */}
                    <div>
                        <label
                            htmlFor="corSecundaria"
                            className="block font-semibold mb-1"
                        >
                            Cor Secundária (cor dos textos)
                        </label>
                        <input
                            type="color"
                            id="corSecundaria"
                            name="corSecundaria"
                            value={config.corSecundaria}
                            onChange={handleChange}
                            className="w-full h-10 cursor-pointer"
                        />
                    </div>

                    {/* BackgroundColor */}
                    <div>
                        <label
                            htmlFor="backgroundColor"
                            className="block font-semibold mb-1"
                        >
                            Cor de Fundo (background geral)
                        </label>
                        <input
                            type="color"
                            id="backgroundColor"
                            name="backgroundColor"
                            value={config.backgroundColor}
                            onChange={handleChange}
                            className="w-full h-10 cursor-pointer"
                        />
                    </div>

                    {/* Nome do Sistema */}
                    <div>
                        <label
                            htmlFor="nomeSistema"
                            className="block font-semibold mb-1"
                        >
                            Nome do Sistema (texto)
                        </label>
                        <input
                            type="text"
                            id="nomeSistema"
                            name="nomeSistema"
                            value={config.nomeSistema}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Digite o nome do sistema"
                        />
                    </div>
                </div>

                {/* Preview */}
                <div
                    className="rounded-lg p-6 mb-6"
                    style={{ backgroundColor: config.backgroundColor }}
                >
                    <header
                        className="text-center text-4xl font-bold py-4 rounded"
                        style={{
                            backgroundColor: config.corPrimaria,
                            color: config.corSecundaria,
                            border: `4px solid ${config.corSecundaria}`,
                            display: "inline-block",
                            width: "100%",
                        }}
                    >
                        {config.nomeSistema}
                    </header>

                    <p
                        className="mt-6 text-center text-lg"
                        style={{ color: config.corSecundaria }}
                    >
                        Este é um preview em tempo real das cores e texto escolhidos.
                    </p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded disabled:opacity-50 transition"
                >
                    {loading ? "Salvando..." : "Salvar Configurações"}
                </button>

                {message && (
                    <p
                        className={`mt-4 font-semibold ${message.includes("Erro") ? "text-red-600" : "text-green-600"
                            }`}
                    >
                        {message}
                    </p>
                )}
            </div>

            <Footer />
        </>
    );
};

export default SystemCustomization;
