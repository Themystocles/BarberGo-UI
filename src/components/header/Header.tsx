import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useRef } from "react";
import { FaSignOutAlt, FaChevronDown, FaHome } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";
import React from "react";

const Header = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { user, loading } = useContext(UserContext);
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fechar dropdown clicando fora
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (loading) {
        return (
            <header className="flex justify-between items-center px-4 md:px-8 py-4 bg-gray-900 text-white shadow-md bg-opacity-90">
                <div>Carregando...</div>
            </header>
        );
    }

    if (!user) {
        return (
            <header className="flex justify-between items-center px-4 md:px-8 py-4 bg-gray-900 text-white shadow-md bg-opacity-90">
                <div>Usuário não encontrado</div>
            </header>
        );
    }

    return (
        <header className="flex justify-between items-center px-4 md:px-8 py-4 bg-gray-900 text-white shadow-md bg-opacity-90">
            {/* Logo */}
            <div
                className="flex items-center gap-2 cursor-pointer hover:text-cyan-400 transition"
                onClick={() => navigate("/Home")}
            >
                <FaHome className="text-xl" />
                <h1 className="hidden sm:block text-xl md:text-2xl font-bold">Barbearia Barba Negra</h1>
            </div>

            {/* Perfil + Sair */}
            <div className="flex items-center gap-4 relative" ref={dropdownRef}>
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    {user.profilePictureUrl ? (
                        <img
                            src={user.profilePictureUrl}
                            alt="Perfil"
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-indigo-500 shadow"
                        />
                    ) : (
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm text-white">
                            {user.name.charAt(0)}
                        </div>
                    )}
                    <span className="text-sm sm:text-base md:text-lg font-semibold text-indigo-400 max-w-[120px] truncate">
                        Olá, {user.name}
                    </span>
                    <FaChevronDown className="text-white hover:text-indigo-300 transition" />
                </div>

                {/* Botão Sair (visível somente em telas maiores que sm) */}
                <button
                    onClick={() => {
                        logout();
                        navigate("/login");
                    }}
                    className="hidden sm:flex items-center gap-2 bg-red-600 hover:bg-red-700 transition text-white px-3 py-1 rounded-md text-sm"
                >
                    <FaSignOutAlt /> Sair
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                    <div className="absolute right-0 top-12 bg-gray-800 text-white shadow-lg rounded-md py-2 w-48 z-50 border border-gray-700">
                        <Link
                            to="/agendamentos"
                            className="block px-4 py-2 hover:bg-indigo-500 transition"
                            onClick={() => setDropdownOpen(false)}
                        >
                            Agendar Corte
                        </Link>

                        {user.userType === 0 && (
                            <Link
                                to="/Barbeiros"
                                className="block px-4 py-2 hover:bg-indigo-500 transition"
                                onClick={() => setDropdownOpen(false)}
                            >
                                Barbeiros
                            </Link>
                        )}

                        {user.userType === 1 && (
                            <Link
                                to="/Clientes_do_dia"
                                className="block px-4 py-2 hover:bg-indigo-500 transition"
                                onClick={() => setDropdownOpen(false)}
                            >
                                Clientes
                            </Link>
                        )}

                        <Link
                            to="/perfil"
                            className="block px-4 py-2 hover:bg-indigo-500 transition"
                            onClick={() => setDropdownOpen(false)}
                        >
                            Perfil
                        </Link>

                        {user.userType === 1 && (
                            <Link
                                to="/AgendaSemanal"
                                className="block px-4 py-2 hover:bg-indigo-500 transition"
                                onClick={() => setDropdownOpen(false)}
                            >
                                Administração
                            </Link>
                        )}

                        {/* Sair (visível apenas em telas pequenas) */}
                        <div
                            onClick={() => {
                                logout();
                                navigate("/login");
                            }}
                            className="block px-4 py-2 hover:bg-red-500 transition cursor-pointer sm:hidden"
                        >
                            <div className="flex items-center gap-2">
                                <FaSignOutAlt /> Sair
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
