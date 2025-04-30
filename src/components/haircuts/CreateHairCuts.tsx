import { useState } from "react";
import axios from "axios";
import { Haircut } from "../../interfaces/Haircut";

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
            console.log(result);
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

            await axios.post("https://localhost:7032/api/Haircuts/create", dataToSend, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Corte cadastrado com sucesso!");
        } catch (error) {
            console.error("Erro ao cadastrar corte:", error);
            alert("Erro ao cadastrar corte. Veja o console.");
        }
    };

    return (
        <div>
            <h4>Cadastrar novo corte</h4>
            <form onSubmit={e => { e.preventDefault(); createcut(); }}>
                <div>
                    <input
                        type="text"
                        placeholder="Nome"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <input
                        type="number"
                        placeholder="Preço"
                        name="preco"
                        value={formData.preco}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <input
                        type="time"
                        placeholder="Duração"
                        name="duracao"
                        value={formData.duracao}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                    {uploading && <p>Enviando imagem...</p>}
                    {formData.imagePath && (
                        <div style={{ marginTop: 10 }}>
                            <img src={formData.imagePath} alt="Preview" width={150} />
                        </div>
                    )}
                </div>

                <button type="submit" disabled={uploading || !formData.imagePath}>
                    {uploading ? "Enviando imagem..." : "Cadastrar"}
                </button>
            </form>
        </div>
    );
};

export default CreateHairCuts;
