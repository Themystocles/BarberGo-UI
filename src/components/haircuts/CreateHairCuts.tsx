import { useState } from "react";
import axios from "axios";
import { Haircut } from "../../interfaces/Haircut";
import Header from "../header/Header";

const CreateHairCuts = () => {
    const [formData, setFormData] = useState<Haircut>({
        name: "",
        preco: 0,
        duracao: "",
        imagePath: ""
    });

    const [uploading, setUploading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "ml_default");

        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/ddrwfsafk/image/upload", {
                method: "POST",
                body: data
            });

            const result = await res.json();
            setFormData(prev => ({
                ...prev,
                imagePath: result.secure_url
            }));
        } catch (err) {
            console.error("Erro ao enviar imagem:", err);
            alert("Erro ao enviar imagem.");
        } finally {
            setUploading(false);
        }
    };

    const createcut = async () => {
        if (!formData.imagePath) {
            alert("Por favor, envie uma imagem antes de cadastrar.");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const durationParts = formData.duracao.split(":");
            const duracaoFormatada =
                durationParts.length === 2 ? `00:${formData.duracao}` : formData.duracao;

            const dataToSend = {
                ...formData,
                duracao: duracaoFormatada
            };

            await axios.post("https://barbergo-api.onrender.com/api/Haircuts/create", dataToSend, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Corte cadastrado com sucesso!");
        } catch (error) {
            console.error("Erro ao cadastrar corte:", error);
            alert("Erro ao cadastrar corte. Veja o console.");
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white flex justify-center items-center px-4 py-10">
                <div className="bg-gray-700 p-8 rounded-2xl shadow-xl w-full max-w-lg">
                    <h2 className="text-3xl font-bold mb-6 text-center">Cadastrar Novo Corte</h2>
                    <form onSubmit={e => { e.preventDefault(); createcut(); }} className="space-y-6">
                        <div>
                            <label className="block text-sm mb-1">Nome</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-3 rounded-xl bg-gray-600 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Nome do corte"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Preço</label>
                            <input
                                type="number"
                                name="preco"
                                value={formData.preco}
                                onChange={handleChange}
                                className="w-full p-3 rounded-xl bg-gray-600 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Preço em R$"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Duração</label>
                            <input
                                type="time"
                                name="duracao"
                                value={formData.duracao}
                                onChange={handleChange}
                                className="w-full p-3 rounded-xl bg-gray-600 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Imagem do corte</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="w-full text-sm text-gray-300"
                            />
                            {uploading && <p className="mt-2 text-yellow-400">Enviando imagem...</p>}
                            {formData.imagePath && (
                                <div className="mt-4">
                                    <img src={formData.imagePath} alt="Preview" className="rounded-xl max-w-full h-40 object-contain mx-auto" />
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={uploading || !formData.imagePath}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 transition rounded-xl shadow-md font-semibold disabled:opacity-50"
                        >
                            {uploading ? "Enviando imagem..." : "Cadastrar Corte"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateHairCuts;
