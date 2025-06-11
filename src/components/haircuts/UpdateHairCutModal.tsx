import { useState } from "react";
import { UpdateHaircutModalProps } from "../../interfaces/UpdateHaircutModalProps";
import { Haircut } from "../../interfaces/Haircut";
import axios from "axios";
import DeleteHaircut from "./DeleteHaircut";

const UpdateHaircutModal = ({ haircut, onClose, onUpdated }: UpdateHaircutModalProps) => {
    const [formData, setFormData] = useState<Haircut>({ ...haircut });
    const [showbtnsave, setShowbtnsave] = useState<boolean>(true);
    const [showcancel, setShowcancel] = useState<boolean>(true)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "ml_default"); // ⬅️ Substitua pelo seu preset do Cloudinary

        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/ddrwfsafk/image/upload", {
                method: "POST",
                body: data,
            });

            const result = await res.json();

            if (result.secure_url) {
                setFormData((prev) => ({ ...prev, imagePath: result.secure_url }));
                alert("Imagem enviada com sucesso!");
            } else {
                throw new Error("Erro ao obter a URL da imagem.");
            }

        } catch (error) {
            console.error("Erro ao fazer upload da imagem ", error);
            alert("Erro ao enviar imagem.");
        }
    };

    const handleSubmit = async () => {

        try {
            const token = localStorage.getItem("token");
            await axios.put(`https://barbergo-api.onrender.com/api/Haircuts/update/${formData.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            onUpdated();
            onClose();
        } catch (error) {
            console.error("Erro ao atualizar o corte:", error);
            alert("Erro ao atualizar o corte. Veja o console.");
        }
    };




    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-white p-6 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Editar Corte</h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nome do corte"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                        type="text"
                        value={formData.duracao}
                        onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
                        placeholder="Duração (min)"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                        type="number"
                        value={formData.preco}
                        onChange={(e) => setFormData({ ...formData, preco: Number(e.target.value) })}
                        placeholder="Preço"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Imagem do Corte</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {formData.imagePath && (
                        <div className="my-4 flex justify-center">
                            <img
                                src={formData.imagePath}
                                alt="Imagem do Corte"
                                className="w-32 h-32 object-cover border-4 border-indigo-500"
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-end mt-6 gap-3">
                    {showcancel &&
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-xl text-white font-medium"
                        >
                            Cancelar
                        </button>
                    }
                    {showbtnsave &&
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold"
                        >
                            Salvar
                        </button>
                    }
                    <DeleteHaircut
                        haircutId={formData.id!}
                        showbtnsave={() =>
                            setShowbtnsave(false)
                        }
                        showcancel={() =>
                            setShowcancel(false)
                        }
                        onDeleted={() => {
                            onUpdated();
                            onClose();

                        }}
                    />

                </div>
            </div>
        </div>
    );
};

export default UpdateHaircutModal;
