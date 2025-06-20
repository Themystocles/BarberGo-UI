import { useEffect, useState } from "react";
import axios from "axios";
import { IAppUser } from "../../interfaces/AppUser";
import { useNavigate } from "react-router-dom";
import Header from "../header/Header";

const Perfil = () => {
    const [user, setUser] = useState<IAppUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const navigate = useNavigate();

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

    useEffect(() => {
        getUser();
    }, []);

    const excluirConta = async () => {
        if (!user?.id) return;

        if (!window.confirm("Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.")) {
            return;
        }

        setLoadingDelete(true);

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://barbergo-api.onrender.com/api/AppUser/delete/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Conta excluída com sucesso!");
            localStorage.removeItem("token");
            navigate("/login");
        } catch (error) {
            console.error("Erro ao excluir conta", error);
            alert("Erro ao excluir conta. Tente novamente mais tarde.");
        } finally {
            setLoadingDelete(false);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-900">
                {loading ? (
                    <p className="text-gray-400 text-lg">Carregando dados do usuário...</p>
                ) : user ? (
                    <div className="bg-white/10 backdrop-blur-md w-full max-w-4xl p-8 rounded-2xl shadow-xl flex flex-col md:flex-row gap-10 text-white border border-white/20">
                        {/* Coluna da foto */}
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

                        {/* Coluna de dados + botões */}
                        <div className="flex-1 flex flex-col justify-between space-y-6">
                            <div>
                                <h2 className="text-3xl font-bold text-indigo-400 mb-4">Perfil do Usuário</h2>
                                <p className="text-lg">
                                    <span className="font-semibold">Nome:</span> {user.name}
                                </p>
                                <p className="text-lg">
                                    <span className="font-semibold">Email:</span> {user.email}
                                </p>
                                {user.phone && (
                                    <p className="text-lg">
                                        <span className="font-semibold">Telefone:</span> {user.phone}
                                    </p>
                                )}
                                <p className="text-lg">
                                    <span className="font-semibold">Data de Criação:</span>{" "}
                                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                                </p>
                                <p className="text-lg">
                                    <span className="font-semibold">Permissão:</span>{" "}
                                    {user.type === 1 ? "Administrador" : "Usuário"}
                                </p>
                            </div>

                            {/* Botões de ações */}
                            <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
                                <button onClick={() => navigate("/Updateperfil")}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
                                >
                                    Editar Perfil
                                </button>
                                <button
                                    onClick={excluirConta}
                                    disabled={loadingDelete}
                                    className={`flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition ${loadingDelete ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                >
                                    {loadingDelete ? "Excluindo..." : "Excluir Conta"}
                                </button>
                            </div>

                            {/* Botão separado para administrador */}
                            {user.type === 1 && (
                                <div className="mt-8 border-t border-white/20 pt-6">
                                    <p className="text-sm text-gray-400 mb-2">Área de Administração</p>
                                    <button
                                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg font-semibold transition"
                                        onClick={() => navigate("/CadastrarAdm")}
                                    >
                                        Cadastrar Novo Administrador
                                    </button>
                                    <button
                                        className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                                        onClick={() => navigate("/PromoverUsuario")}
                                    >
                                        Promover Usuario para Administrador
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-red-500 text-lg">Erro ao carregar perfil do usuário.</p>
                )}
            </div>
        </>
    );
};

export default Perfil;
