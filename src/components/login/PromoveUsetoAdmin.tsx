import { useState } from "react";
import Header from "../header/Header";
import { IAppUser } from "../../interfaces/AppUser";
import axios from "axios";
import { FaSearch, FaCheckCircle } from "react-icons/fa";

export enum UserType {
    Cliente = 0,
    Admin = 1
}

const PromoveUserToAdmin = () => {
    const [email, setEmail] = useState<string>("");
    const [user, setUser] = useState<IAppUser | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [promoting, setPromoting] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [confirmPromote, setConfirmPromote] = useState<boolean>(false);

    const GetEmail = async () => {
        setLoading(true);
        setUser(null);
        setError("");
        setMessage("");

        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://barbergo-api.onrender.com/api/AppUser/GetUserByEmail", {
                params: { email },
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data) {
                setUser(response.data);
            } else {
                setError("Usuário não encontrado.");
            }
        } catch (error) {
            setError("Erro ao buscar o usuário. Verifique o email e tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const PromoveUser = async () => {
        if (!user) return;

        setPromoting(true);
        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("token");
            const novoTipo = user.type === UserType.Admin ? UserType.Cliente : UserType.Admin;

            await axios.post("https://barbergo-api.onrender.com/api/AppUser/PromoverUsuarioparaAdmin", {
                email,
                tipo: novoTipo
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const mensagem = novoTipo === UserType.Admin
                ? `Usuário ${user.name} promovido a administrador com sucesso.`
                : `Usuário ${user.name} rebaixado para cliente com sucesso.`;

            setMessage(mensagem);
            setUser({ ...user, type: novoTipo });
            setConfirmPromote(false);
        } catch (error) {
            setError("Erro ao atualizar o tipo do usuário.");
        } finally {
            setPromoting(false);
        }
    };

    const renderUserType = (type: UserType) => {
        return type === UserType.Admin ? "Administrador" : "Cliente";
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center py-10 px-4 sm:px-6">
                <div className="w-full max-w-3xl">
                    <p className="mb-8 text-xl font-semibold text-center">
                        Apenas Administradores têm acesso a esta tela
                    </p>

                    {/* Pesquisa */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-8">
                        <input
                            type="email"
                            placeholder="Digite o email do usuário"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-5 py-3 rounded-md border border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <button
                            onClick={GetEmail}
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition"
                        >
                            <FaSearch />
                            Buscar
                        </button>
                    </div>

                    {loading && (
                        <p className="text-gray-400 mb-4 text-center">Buscando usuário...</p>
                    )}

                    {error && (
                        <div className="bg-red-800 bg-opacity-40 text-red-300 border border-red-600 p-4 rounded mb-6 text-center">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="flex items-center gap-2 justify-center mb-6 p-4 bg-green-800 bg-opacity-40 text-green-300 border border-green-600 rounded text-center">
                            <FaCheckCircle />
                            <p>{message}</p>
                        </div>
                    )}

                    {/* Dados do usuário */}
                    {user && (
                        <div className="bg-gray-800 bg-opacity-70 rounded-lg shadow-lg border border-gray-700 p-6 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                            <img
                                src={user.profilePictureUrl}
                                alt="Foto do usuário"
                                className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg object-cover border border-gray-600"
                            />

                            <div className="flex-1 text-gray-100 space-y-2 w-full">
                                <p><strong>Nome:</strong> {user.name}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Telefone:</strong> {user.phone}</p>
                                <p><strong>Tipo:</strong> {renderUserType(user.type ?? UserType.Cliente)}</p>

                                {!confirmPromote ? (
                                    <button
                                        onClick={() => setConfirmPromote(true)}
                                        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md transition w-full sm:w-auto"
                                    >
                                        {user.type === UserType.Admin
                                            ? "Rebaixar para Cliente"
                                            : "Promover a Administrador"}
                                    </button>
                                ) : (
                                    <div className="mt-4">
                                        <p className="text-gray-300 mb-3 text-sm sm:text-base">
                                            Tem certeza que deseja {user.type === UserType.Admin ? "rebaixar" : "promover"}{" "}
                                            <strong>{user.name}</strong> {user.type === UserType.Admin ? "para cliente" : "a administrador"}?
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button
                                                onClick={PromoveUser}
                                                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md transition disabled:opacity-50 w-full sm:w-auto"
                                                disabled={promoting}
                                            >
                                                {promoting
                                                    ? (user.type === UserType.Admin ? "Rebaixando..." : "Promovendo...")
                                                    : (user.type === UserType.Admin ? "Sim, rebaixar" : "Sim, promover")}
                                            </button>
                                            <button
                                                onClick={() => setConfirmPromote(false)}
                                                className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-md transition w-full sm:w-auto"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PromoveUserToAdmin;
