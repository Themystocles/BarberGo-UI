import { Link } from "react-router-dom";
import { GiScissors } from "react-icons/gi";
import { FaCalendarAlt, FaUser } from "react-icons/fa";
import Header from "../header/Header";
import useUser from "../../hooks/useUser";

const Home = () => {
    const { userType, loading } = useUser();

    return (
        <div
            className="min-h-screen bg-cover bg-center text-white flex flex-col"
            style={{
                backgroundImage:
                    "url('https://i.pinimg.com/originals/19/26/6e/19266e1b4e9597fc43dc5cb056d3100b.jpg')",
            }}
        >
            {/* Header */}
            <Header />

            {/* Conteúdo Principal */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 bg-black bg-opacity-60">
                <h2 className="text-4xl font-bold mb-4">Bem-vindo ao sistema da Barbearia</h2>
                <p className="text-lg text-gray-300 mb-10">
                    Gerencie seus agendamentos, clientes e serviços com facilidade.
                </p>

                {/* Aqui vem o loader ou o conteúdo principal */}
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <svg
                            className="animate-spin h-10 w-10 text-cyan-400"
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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl">
                        <Link
                            to="/agendamentos"
                            className="bg-indigo-600 hover:bg-indigo-700 transition p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center"
                        >
                            <FaCalendarAlt size={40} className="mb-4" />
                            <h3 className="text-xl font-semibold">Agendamentos</h3>
                            <p className="text-gray-200 text-sm mt-2">Visualize e organize horários</p>
                        </Link>

                        {userType ? (
                            <Link
                                to="/Clientes_do_dia"
                                className="bg-indigo-600 hover:bg-indigo-700 transition p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center"
                            >
                                <FaUser size={40} className="mb-4" />
                                <h3 className="text-xl font-semibold">Clientes</h3>
                                <p className="text-gray-200 text-sm mt-2">Gerencie sua clientela</p>
                            </Link>
                        ) : (
                            <Link
                                to="/MeusAgendamentos"
                                className="bg-indigo-600 hover:bg-indigo-700 transition p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center"
                            >
                                <FaUser size={40} className="mb-4" />
                                <h3 className="text-xl font-semibold">Meus Agendamentos</h3>
                                <p className="text-gray-200 text-sm mt-2">Consulte seus agendamentos</p>
                            </Link>
                        )}

                        <Link
                            to="/CortesDisponíveis"
                            className="bg-indigo-600 hover:bg-indigo-700 transition p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center"
                        >
                            <GiScissors size={40} className="mb-4" />
                            <h3 className="text-xl font-semibold">Serviços</h3>
                            <p className="text-gray-200 text-sm mt-2">Adicione e edite seus serviços</p>
                        </Link>
                    </div>
                )}
            </main>

            {/* Rodapé */}
            <footer className="text-center p-4 text-sm text-gray-400 bg-gray-900 bg-opacity-90">
                © 2025 Barbearia Barba Negra. Todos os direitos reservados.
            </footer>
        </div>
    );
};

export default Home;
