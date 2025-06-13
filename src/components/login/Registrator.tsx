import { useState } from "react";
import axios from "axios";
import { IAppUser } from "../../interfaces/AppUser.tsx";
import { Link } from "react-router-dom";

export default function UserRegistration() {
    const [user, setUser] = useState<IAppUser>({
        id: 0,
        name: "",
        email: "",
        phone: "",
        passwordHash: "",
        googleId: "",
        profilePictureUrl: "",
        createdAt: new Date().toISOString(),
        type: 0,
    });

    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "ml_default");

        try {
            setIsUploading(true);
            const res = await fetch("https://api.cloudinary.com/v1_1/ddrwfsafk/image/upload", {
                method: "POST",
                body: data,
            });

            const result = await res.json();
            if (result.secure_url) {
                setUser((prev) => ({ ...prev, profilePictureUrl: result.secure_url }));
            } else {
                throw new Error("Erro ao obter a URL da imagem.");
            }
        } catch (error) {
            setMessage("Erro ao enviar imagem.");
            setMessageType("error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);
        setMessageType(null);

        try {
            await axios.post("https://barbergo-api.onrender.com/api/AppUser/create", user);
            setMessage("Usuário cadastrado com sucesso!");
            setMessageType("success");
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 409) {
                    setMessage("Este email já está cadastrado. Por favor, faça login.");
                    setMessageType("error");
                } else {
                    setMessage("Erro ao cadastrar usuário. Tente novamente.");
                    setMessageType("error");
                }
            } else {
                setMessage("Erro ao cadastrar usuário. Tente novamente.");
                setMessageType("error");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 p-4">
            <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden">
                <div className="hidden md:block md:w-1/2 relative">
                    <img
                        src="https://d2zdpiztbgorvt.cloudfront.net/region1/br/293956/biz_photo/394459b035ce4205a0ddb43a053874-barbearia-barba-negra-biz-photo-567f5ccdfb0a401690edd11f14ad92-booksy.jpeg"
                        alt="Imagem de barbearia"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-40 rounded-l-lg"></div>
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">
                        Criar Conta
                    </h2>

                    {message && (
                        <div className={`text-center mb-4 p-3 rounded-lg ${messageType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {message}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-gray-700">Nome</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Digite seu nome"
                                className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                                value={user.name}
                                onChange={handleChange}
                                disabled={isUploading || isSubmitting}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Digite seu e-mail"
                                className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                                value={user.email}
                                onChange={handleChange}
                                disabled={isUploading || isSubmitting}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Telefone</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Digite seu telefone"
                                className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={user.phone}
                                onChange={handleChange}
                                disabled={isUploading || isSubmitting}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Senha</label>
                            <input
                                type="password"
                                name="passwordHash"
                                placeholder="Digite sua senha"
                                className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                                value={user.passwordHash}
                                onChange={handleChange}
                                disabled={isUploading || isSubmitting}
                            />
                        </div>

                        <label className="block text-gray-700">Foto de Perfil</label>
                        <input
                            type="file"
                            accept="image/*"
                            name="upload"
                            className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onChange={handleImageUpload}
                            disabled={isUploading || isSubmitting}
                        />

                        {(isUploading || isSubmitting) && (
                            <div className="flex items-center justify-center space-x-2 mt-2">
                                <div className="w-5 h-5 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-indigo-600 font-semibold">
                                    {isUploading ? "Enviando imagem..." : "Cadastrando usuário..."}
                                </span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isUploading || isSubmitting}
                        >
                            Cadastrar
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-600 mt-5">
                        Já tem uma conta?{' '}
                        <Link to="/login" className="text-indigo-600 hover:underline">
                            Faça login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
