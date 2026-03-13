import { Link } from "react-router-dom";
import { GiScissors } from "react-icons/gi";
import { FaCalendarAlt, FaUser } from "react-icons/fa";
import Header from "../header/Header";
import useUser from "../../hooks/useUser";
import Footer from "../footer/Footer";
import { CustomizationContext } from "../../context/CustomizationContext";
import { useContext } from "react";

const Home = () => {
    const { userType, loading } = useUser();
    const { customization } = useContext(CustomizationContext);

    return (
        <div
            className="min-h-screen bg-cover bg-center text-white flex flex-col relative"
            style={{
                backgroundImage: `url(${customization?.backgroundUrl})`,
            }}
        >
            {/* overlay escuro para contraste */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

            {/* Header */}
            <Header />

            {/* Conteúdo */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10">

                {/* Título */}
                <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-wide">
                    Bem-vindo ao ambiente{" "}
                    <span style={{ color: customization?.corSecundaria }}>
                        {customization?.nomeSistema || "Seu Negócio"}
                    </span>
                </h2>

                <p className="text-lg text-gray-300 mb-12 max-w-xl">
                    Gerencie seus agendamentos, clientes e serviços com facilidade.
                </p>

                {/* Loader */}
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <svg
                            className="animate-spin h-10 w-10"
                            style={{ color: customization?.corSecundaria }}
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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-5xl">

                        {/* Agendamentos */}
                        <Link
                            to="/agendamentos"
                            className="group backdrop-blur-xl bg-white/10 border border-white/10 hover:bg-white/20 transition p-8 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center hover:scale-105"
                        >
                            <FaCalendarAlt
                                size={42}
                                className="mb-4 transition group-hover:scale-110"
                                style={{ color: customization?.corSecundaria }}
                            />

                            <h3 className="text-xl font-semibold">Agendamentos</h3>

                            <p className="text-gray-300 text-sm mt-2">
                                Visualize e organize horários
                            </p>
                        </Link>

                        {/* Clientes ou Meus Agendamentos */}
                        {userType ? (
                            <Link
                                to="/Clientes_do_dia"
                                className="group backdrop-blur-xl bg-white/10 border border-white/10 hover:bg-white/20 transition p-8 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center hover:scale-105"
                            >
                                <FaUser
                                    size={42}
                                    className="mb-4 transition group-hover:scale-110"
                                    style={{ color: customization?.corSecundaria }}
                                />

                                <h3 className="text-xl font-semibold">Clientes</h3>

                                <p className="text-gray-300 text-sm mt-2">
                                    Gerencie sua clientela
                                </p>
                            </Link>
                        ) : (
                            <Link
                                to="/MeusAgendamentos"
                                className="group backdrop-blur-xl bg-white/10 border border-white/10 hover:bg-white/20 transition p-8 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center hover:scale-105"
                            >
                                <FaUser
                                    size={42}
                                    className="mb-4 transition group-hover:scale-110"
                                    style={{ color: customization?.corSecundaria }}
                                />

                                <h3 className="text-xl font-semibold">Meus Agendamentos</h3>

                                <p className="text-gray-300 text-sm mt-2">
                                    Consulte seus agendamentos
                                </p>
                            </Link>
                        )}

                        {/* Serviços */}
                        <Link
                            to="/CortesDisponíveis"
                            className="group backdrop-blur-xl bg-white/10 border border-white/10 hover:bg-white/20 transition p-8 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center hover:scale-105"
                        >
                            <GiScissors
                                size={42}
                                className="mb-4 transition group-hover:scale-110"
                                style={{ color: customization?.corSecundaria }}
                            />

                            <h3 className="text-xl font-semibold">Serviços</h3>

                            <p className="text-gray-300 text-sm mt-2">
                                Adicione e edite seus serviços
                            </p>
                        </Link>
                    </div>
                )}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Home;