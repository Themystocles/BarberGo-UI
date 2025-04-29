import React from "react";
import { Link } from "react-router-dom";
import { GiScissors } from "react-icons/gi"; // Ícone de tesoura
import { FaCalendarAlt, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Header from "../header/Header";




const Home = () => {

    const { logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white flex flex-col">
            {/* Header */}

            <Header />

            {/* Conteúdo Principal */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-4xl font-bold mb-4">Bem-vindo ao sistema da Barbearia</h2>
                <p className="text-lg text-gray-300 mb-10">
                    Gerencie seus agendamentos, clientes e serviços com facilidade.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl">
                    <Link
                        to="/agendamentos"
                        className="bg-indigo-600 hover:bg-indigo-700 transition p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center"
                    >
                        <FaCalendarAlt size={40} className="mb-4" />
                        <h3 className="text-xl font-semibold">Agendamentos</h3>
                        <p className="text-gray-200 text-sm mt-2">Visualize e organize horários</p>
                    </Link>

                    <Link
                        to="/clientes"
                        className="bg-indigo-600 hover:bg-indigo-700 transition p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center"
                    >
                        <FaUser size={40} className="mb-4" />
                        <h3 className="text-xl font-semibold">Clientes</h3>
                        <p className="text-gray-200 text-sm mt-2">Gerencie sua clientela</p>
                    </Link>

                    <Link
                        to="/CortesDisponíveis"
                        className="bg-indigo-600 hover:bg-indigo-700 transition p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center"
                    >
                        <GiScissors size={40} className="mb-4" />
                        <h3 className="text-xl font-semibold">Serviços</h3>
                        <p className="text-gray-200 text-sm mt-2">Adicione e edite seus serviços</p>
                    </Link>
                </div>
            </main>

            {/* Rodapé */}
            <footer className="text-center p-4 text-sm text-gray-400 bg-gray-900">
                © 2025 Barbearia Barba Negra. Todos os direitos reservados.
            </footer>
        </div >
    );
};

export default Home;
