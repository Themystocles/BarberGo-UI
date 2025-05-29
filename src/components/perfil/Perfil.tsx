import { useEffect, useState } from "react";
import axios from "axios";
import { IAppUser } from "../../interfaces/AppUser";
import { useNavigate } from "react-router-dom";

const Perfil = () => {
    const [user, setUser] = useState<IAppUser>();
    const navigate = useNavigate();

    const getUser = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://barbergo-api.onrender.com/api/AppUser/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(response.data);
        } catch (error) {
            console.error("Erro ao buscar dados do usuário", error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10">
            {user ? (
                <div className="bg-white/10 backdrop-blur-md w-full max-w-4xl p-8 rounded-2xl shadow-xl flex flex-col md:flex-row gap-10 text-white border border-white/20">
                    <div className="flex flex-col items-center md:items-start">
                        {user.profilePictureUrl ? (
                            <img
                                src={user.profilePictureUrl}
                                alt="Foto de perfil"
                                className="w-40 h-40 rounded-full border-4 border-indigo-500 object-cover shadow-lg"
                            />
                        ) : (
                            <div className="w-40 h-40 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 border-4 border-gray-600 shadow-md">
                                Sem Foto
                            </div>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between space-y-4">
                        <div>
                            <h2 className="text-3xl font-bold text-indigo-400 mb-4">Perfil do Usuário</h2>
                            <p className="text-lg"><span className="font-semibold">Nome:</span> {user.name}</p>
                            <p className="text-lg"><span className="font-semibold">Email:</span> {user.email}</p>
                            {user.phone && <p className="text-lg"><span className="font-semibold">Telefone:</span> {user.phone}</p>}
                            <p className="text-lg"><span className="font-semibold">Data de Criação:</span> {new Date(user.createdAt).toLocaleDateString("pt-BR")}</p>
                            <p className="text-lg"><span className="font-semibold">Permissão: </span> {user.type === 1 ? "Administrador" : "Usuário"}</p>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row gap-4 flex-wrap">
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition">
                                Editar Perfil
                            </button>
                            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition">
                                Excluir Conta
                            </button>
                            <button
                                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition"
                                onClick={() => navigate("/Home")}
                            >
                                Voltar para Home
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-gray-600 text-lg">Carregando dados do usuário...</p>
            )}
        </div>
    );
};

export default Perfil;
