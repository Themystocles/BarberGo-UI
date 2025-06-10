import axios from "axios";
import { useEffect, useState } from "react";
import { IAppUser } from "../../interfaces/AppUser";
import Header from "../header/Header";

const UpdatePerfil = () => {
    const [User, setUser] = useState<IAppUser>();
    const [loading, setLoading] = useState(true);

    const getUser = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://barbergo-api.onrender.com/api/AppUser/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
        } catch (error) {
            console.error("Erro ao buscar dados do usuário", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            await axios.put(`https://barbergo-api.onrender.com/api/AppUser/update/${User?.id}`, User, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Usuário editado com sucesso!");
        } catch {
            alert("Erro ao editar o usuário.");
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <>
            <Header />
            {loading ? (
                <div className="flex justify-center items-center h-[60vh]">
                    <svg
                        className="animate-spin h-12 w-12 text-cyan-400"
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
                </div>
            ) : (
                User && (
                    <div className="max-w-md mx-auto mt-8 p-6 bg-gray-800 border border-gray-700 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold text-center text-white mb-6">Editar Perfil</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Nome</label>
                                <input
                                    type="text"
                                    value={User?.name}
                                    placeholder="Nome"
                                    onChange={(e) => setUser({ ...User, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Email</label>
                                <input
                                    type="text"
                                    value={User?.email}
                                    placeholder="Email"
                                    onChange={(e) => setUser({ ...User, email: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Telefone</label>
                                <input
                                    type="text"
                                    value={User?.phone}
                                    placeholder="Telefone"
                                    onChange={(e) => setUser({ ...User, phone: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">URL da Foto de Perfil</label>
                                <input
                                    type="text"
                                    value={User?.profilePictureUrl}
                                    placeholder="URL da Foto de Perfil"
                                    onChange={(e) => setUser({ ...User, profilePictureUrl: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            {User?.profilePictureUrl && (
                                <div className="my-4 flex justify-center">
                                    <img
                                        src={User.profilePictureUrl}
                                        alt="Foto de perfil"
                                        className="w-32 h-32 object-cover border-4 border-indigo-500"
                                    />
                                </div>
                            )}
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold transition-colors"
                            >
                                Salvar
                            </button>
                        </form>
                    </div>
                )
            )}
        </>
    );
};

export default UpdatePerfil;
