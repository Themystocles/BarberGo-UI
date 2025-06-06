import { useState } from "react";
import axios from "axios";
import { IAppUser } from "../../interfaces/AppUser.tsx";
import { Link } from "react-router-dom";
import Header from "../header/Header.tsx";

export default function RegistratorUserAdmin() {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleImageupload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(
                "https://barbergo-api.onrender.com/api/AppUser/upload",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            const imageUrl = response.data.url;
            setUser((prev) => ({ ...prev, profilePictureUrl: imageUrl }));
        } catch (err) {
            console.error("Erro ao fazer upload da imagem:", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (user.type === 0) {
            alert("Por favor, escolha o tipo de usuário.");
            return;
        }

        try {
            await axios.post("https://barbergo-api.onrender.com/api/AppUser/createUserAdmin", user, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            alert("Usuário cadastrado com sucesso!");
        } catch (error) {
            alert("Erro ao cadastrar usuário");
            console.error(error);
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
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Criar Conta (Admin)
                    </h2>
                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {/* Coluna 1 */}
                        <div className="space-y-5">
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

                            <div>
                                <label className="block mb-1 text-gray-300">Senha</label>
                                <input
                                    type="password"
                                    name="passwordHash"
                                    placeholder="Digite sua senha"
                                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
                                    required
                                    value={user.passwordHash}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Coluna 2 */}
                        <div className="space-y-5">
                            <div>
                                <label className="block mb-1 text-gray-300">Tipo de Usuário</label>
                                <select
                                    name="type"
                                    required
                                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
                                    value={user.type}
                                    onChange={(e) =>
                                        setUser({
                                            ...user,
                                            type: Number(e.target.value),
                                        })
                                    }
                                >
                                    <option value={0} disabled>
                                        Escolha o tipo de usuário
                                    </option>
                                    <option value={1}>Administrador</option>
                                    <option value={2}>Usuário</option>
                                </select>
                            </div>

                            {/* Input de upload file (antes da foto) */}
                            <div>
                                <label className="block mb-1 text-gray-300">Foto de Perfil</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    name="upload"
                                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
                                    onChange={handleImageupload}
                                />
                            </div>

                            {/* Espaço reservado para foto */}
                            <div className="w-32 h-32 rounded-full border-4 border-indigo-500 mt-2 flex items-center justify-center overflow-hidden bg-gray-800">
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

                        {/* Botão de submit ocupando as duas colunas */}
                        <div className="md:col-span-2 mt-6 flex flex-col items-center gap-4">
                            <button
                                type="submit"
                                className="w-full max-w-md py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-lg focus:ring-2 focus:ring-indigo-500"
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
