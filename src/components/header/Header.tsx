import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect, useContext } from "react";
import { FaSignOutAlt, FaChevronDown, FaHome } from "react-icons/fa";
import { useUserContext } from "../../context/UserContext";
import { CustomizationContext } from "../../context/CustomizationContext";

const Header = () => {
    const { logoutUser, user, loading } = useUserContext();
    const navigate = useNavigate();

    const { customization, loading: loadingCustomization } =
        useContext(CustomizationContext);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const hexToRGBA = (hex: string, alpha: number) => {
        if (!hex) return `rgba(17,24,39,${alpha})`;

        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);

        return `rgba(${r},${g},${b},${alpha})`;
    };

    const headerColor = customization?.corPrimaria
        ? hexToRGBA(customization.corPrimaria, 0.85)
        : "rgba(17,24,39,0.85)";

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (loading || loadingCustomization) {
        return (
            <header
                className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10 shadow-lg"
                style={{ backgroundColor: headerColor }}
            >
                <div className="px-6 py-4 text-white">Carregando...</div>
            </header>
        );
    }

    return (
        <header
            className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10 shadow-xl"
            style={{ backgroundColor: headerColor }}
        >
            <div className="flex justify-between items-center px-4 md:px-8 py-3">

                {/* Logo */}
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => navigate("/Home")}
                >
                    {customization?.logoUrl ? (
                        <img
                            src={customization.logoUrl}
                            alt="Logo"
                            className="h-10 rounded-md object-contain transition group-hover:scale-105"
                        />
                    ) : (
                        <FaHome className="text-xl text-white/90 group-hover:text-white transition" />
                    )}

                    <h1
                        className="hidden sm:block text-xl md:text-2xl font-bold tracking-wide"
                        style={{ color: customization?.corSecundaria }}
                    >
                        {customization?.nomeSistema}
                    </h1>
                </div>

                {/* Perfil */}
                <div className="flex items-center gap-4 relative" ref={dropdownRef}>
                    {user && (
                        <div
                            className="flex items-center gap-3 cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            {user.profilePictureUrl ? (
                                <img
                                    src={user.profilePictureUrl}
                                    alt="Perfil"
                                    className="w-9 h-9 rounded-full object-cover border border-white/20"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
                                    {user.name.charAt(0)}
                                </div>
                            )}

                            <span className="hidden md:block text-sm text-white/90 font-medium">
                                {user.name}
                            </span>

                            <FaChevronDown className="text-white/70 text-xs" />
                        </div>
                    )}

                    {/* botão sair */}
                    <button
                        onClick={() => {
                            logoutUser();
                            navigate("/login");
                        }}
                        className="hidden sm:flex items-center gap-2 bg-red-500/90 hover:bg-red-600 text-white px-4 py-1.5 rounded-full text-sm shadow-md transition"
                    >
                        <FaSignOutAlt />
                        Sair
                    </button>

                    {/* Dropdown */}
                    {dropdownOpen && (
                        <div className="absolute right-0 top-14 w-56 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-2 animate-fadeIn">

                            <Link
                                to="/agendamentos"
                                className="block px-4 py-2 hover:bg-white/10 transition"
                                onClick={() => setDropdownOpen(false)}
                            >
                                Agendar Corte
                            </Link>

                            {user?.type === 0 && (
                                <Link
                                    to="/Barbeiros"
                                    className="block px-4 py-2 hover:bg-white/10 transition"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Barbeiros
                                </Link>
                            )}

                            {user?.type === 1 && (
                                <Link
                                    to="/Clientes_do_dia"
                                    className="block px-4 py-2 hover:bg-white/10 transition"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Clientes
                                </Link>
                            )}

                            <Link
                                to="/perfil"
                                className="block px-4 py-2 hover:bg-white/10 transition"
                                onClick={() => setDropdownOpen(false)}
                            >
                                Perfil
                            </Link>

                            {user?.type === 1 && (
                                <Link
                                    to="/AgendaSemanal"
                                    className="block px-4 py-2 hover:bg-white/10 transition"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Administração
                                </Link>
                            )}

                            {user?.type === 1 && (
                                <Link
                                    to="/SystemCustomization"
                                    className="block px-4 py-2 hover:bg-white/10 transition"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Estilos
                                </Link>
                            )}

                            <div
                                onClick={() => {
                                    logoutUser();
                                    navigate("/login");
                                }}
                                className="sm:hidden px-4 py-2 hover:bg-red-500 cursor-pointer"
                            >
                                <div className="flex items-center gap-2">
                                    <FaSignOutAlt />
                                    Sair
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;