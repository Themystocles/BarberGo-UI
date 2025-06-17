import { useState, useEffect } from "react";
import axios from "axios";
import { IAppUser } from "../../interfaces/AppUser.tsx";
import { Link } from "react-router-dom";
import Header from "../header/Header.tsx";

export default function RegistratorUserAdmin() {
    const [user, setUser] = useState<
        IAppUser & { password: string; confirmPassword: string }
    >({
        id: 0,
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        googleId: "",
        profilePictureUrl: "",
        createdAt: new Date().toISOString(),
        type: 0,
    });

    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");
    const [mensagem, setMensagem] = useState<
        { texto: string; tipo: "success" | "error" } | null
    >(null);

    useEffect(() => {
        if (mensagem) {
            const timer = setTimeout(() => setMensagem(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [mensagem]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: name === "type" ? Number(value) : value,
        }));
    };

    const handleImageupload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadMessage("Carregando foto...");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ml_default");

        try {
            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/ddrwfsafk/image/upload",
                formData
            );

            if (response.data.secure_url) {
                setUser((prev) => ({ ...prev, profilePictureUrl: response.data.secure_url }));
                setUploadMessage("Foto carregada com sucesso!");
            } else {
                throw new Error("URL da imagem não retornada.");
            }
        } catch (error) {
            console.error("Erro ao fazer upload da imagem:", error);
            setUploadMessage("Erro ao carregar a foto.");
        } finally {
            setUploading(false);
            setTimeout(() => setUploadMessage(""), 3000);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (user.type === 0) {
            setMensagem({ texto: "Por favor, escolha o tipo de usuário.", tipo: "error" });
            return;
        }
        if (user.password.length < 6) {
            setMensagem({ texto: "A senha deve conter no mínimo 6 caracteres.", tipo: "error" });
            return;
        }
        if (user.password !== user.confirmPassword) {
            setMensagem({ texto: "As senhas não coincidem.", tipo: "error" });
            return;
        }

        try {
            await axios.post(
                "https://barbergo-api.onrender.com/api/AppUser/createUserAdmin",
                {
                    Name: user.name,
                    Email: user.email,
                    Phone: user.phone,
                    Password: user.password,
                    ConfirmPassword: user.confirmPassword,
                    ProfilePictureUrl: user.profilePictureUrl,
                    Type: user.type,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            setMensagem({ texto: "Usuário cadastrado com sucesso!", tipo: "success" });

            setUser({
                id: 0,
                name: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",
                googleId: "",
                profilePictureUrl: "",
                createdAt: new Date().toISOString(),
                type: 0,
            });
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const msg =
                    error.response?.data?.message || "Erro ao cadastrar usuário. Tente novamente.";
                setMensagem({ texto: msg, tipo: "error" });
            } else {
                setMensagem({ texto: "Erro ao cadastrar usuário. Tente novamente.", tipo: "error" });
            }
        }
    };

    return (
        <>
            <Header />
            <div
                className="min-h-screen bg-cover bg-center flex items-center justify-center p-6"
                style={{
                    backgroundImage:
                        "url('https://i.pinimg.com/originals/19/26/6e/19266e1b4e9597fc43dc5cb056d3100b.jpg')",
                }}
            >
                <div className="w-full max-w-4xl bg-black bg-opacity-70 text-white rounded-xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-center mb-6">Criar Conta (Admin)</h2>

                    {mensagem && (
                        <div
                            className={`text-center mb-6 p-3 rounded ${mensagem.tipo === "success"
                                    ? "bg-green-600 text-white"
                                    : "bg-red-600 text-white"
                                }`}
                        >
                            {mensagem.texto}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 1ª fileira: Nome, Email, Telefone */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <label className="block mb-1 text-gray-300">Nome</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Digite seu nome"
                                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
                                    required
                                    value={user.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-gray-300">E-mail</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Digite seu e-mail"
                                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
                                    required
                                    value={user.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-gray-300">Telefone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Digite seu telefone"
                                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
                                    value={user.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* 2ª fileira: Senha, Confirmar Senha, Tipo */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <label className="block mb-1 text-gray-300">Senha</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Digite sua senha"
                                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
                                    required
                                    value={user.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-gray-300">Confirmar Senha</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirme sua senha"
                                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
                                    required
                                    value={user.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-gray-300">Tipo de Usuário</label>
                                <select
                                    name="type"
                                    required
                                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
                                    value={user.type}
                                    onChange={handleChange}
                                >
                                    <option value={0} disabled>
                                        Escolha o tipo de usuário
                                    </option>
                                    <option value={1}>Administrador</option>
                                    <option value={2}>Usuário</option>
                                </select>
                            </div>
                        </div>

                        {/* 3ª fileira: Upload + preview lado a lado */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                            <div className="flex-1">
                                <label className="block mb-1 text-gray-300">Foto de Perfil</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    name="upload"
                                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
                                    onChange={handleImageupload}
                                    disabled={uploading}
                                />
                                <div className="mt-2 text-sm text-indigo-400 flex items-center min-h-[1.5rem]">
                                    {uploading && (
                                        <svg
                                            className="animate-spin h-5 w-5 mr-2 text-indigo-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            ></path>
                                        </svg>
                                    )}
                                    {uploadMessage}
                                </div>
                            </div>

                            <div className="flex-shrink-0 w-32 h-32 rounded-full border-4 border-indigo-500 overflow-hidden bg-gray-800 flex items-center justify-center">
                                {user.profilePictureUrl ? (
                                    <img
                                        src={user.profilePictureUrl}
                                        alt="Foto de perfil"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm text-gray-400 text-center px-2">
                                        Foto de Perfil
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Botão enviar */}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-full max-w-md py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-lg focus:ring-2 focus:ring-indigo-500"
                                disabled={uploading}
                            >
                                Cadastrar
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm text-gray-400 mt-6">
                        voltar para{" "}
                        <Link to="/home" className="text-indigo-400 hover:underline">
                            home
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
