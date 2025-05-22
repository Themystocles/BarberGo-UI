import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { FaSignOutAlt, FaChevronDown, FaHome } from "react-icons/fa";
import axios from "axios";
import useUser from "../../hooks/useUser";

const Header = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState<string>("");
    const [profilePictureUrl, setProfilePictureUrl] = useState<string>("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { userType } = useUser();

    console.log(userType)
    const getNameUser = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://localhost:7032/api/AppUser/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setName(response.data.name);
            setProfilePictureUrl(response.data.profilePictureUrl);
        } catch (error) {
            console.error("Erro ao buscar dados do usuário", error);
        }
    };

    useEffect(() => {
        getNameUser();

        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="flex justify-between items-center px-8 py-4 bg-gray-900 text-white shadow-md bg-opacity-90">

            <div
                className="flex items-center gap-2 cursor-pointer hover:text-cyan-400 transition"
                onClick={() => navigate("/Home")}
            >
                <FaHome className="text-xl" />
                <h1 className="text-2xl font-bold">Barbearia Barba Negra</h1>
            </div>

            <div className="flex items-center gap-6 relative" ref={dropdownRef}>
                {name && (
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        {profilePictureUrl ? (
                            <img
                                src={profilePictureUrl}
                                alt="Perfil"
                                className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500 shadow"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm text-white">
                                {name.charAt(0)}
                            </div>
                        )}

                        <span className="text-lg font-semibold text-indigo-400">Olá, {name}</span>
                        <FaChevronDown className="text-white hover:text-indigo-300 transition" />
                    </div>
                )}

                {dropdownOpen && (
                    <div className="absolute right-20 top-12 bg-gray-800 text-white shadow-lg rounded-md py-2 w-48 z-50 border border-gray-700">

                        <Link
                            to="/agendamentos"
                            className="block px-4 py-2 hover:bg-indigo-500 transition"
                            onClick={() => setDropdownOpen(false)}
                        >
                            Agendar Corte
                        </Link>
                        {userType == 0 &&
                            <Link
                                to="/Barbeiros"
                                className="block px-4 py-2 hover:bg-indigo-500 transition"
                                onClick={() => setDropdownOpen(false)}
                            >
                                Barbeiros
                            </Link>
                        }
                        {userType == 1 &&
                            <Link
                                to="/Clientes_do_dia"
                                className="block px-4 py-2 hover:bg-indigo-500 transition"
                                onClick={() => setDropdownOpen(false)}
                            >
                                Clientes
                            </Link>
                        }
                        <Link
                            to="/perfil"
                            className="block px-4 py-2 hover:bg-indigo-500 transition"
                            onClick={() => setDropdownOpen(false)}
                        >
                            Perfil
                        </Link>

                        {userType == 1 &&
                            <Link
                                to="/AgendaSemanal"
                                className="block px-4 py-2 hover:bg-indigo-500 transition"
                                onClick={() => setDropdownOpen(false)}
                            >
                                Administração
                            </Link>
                        }
                        {userType == 0 &&

                            <div
                                onClick={() => {
                                    logout();
                                    navigate("/login");
                                }}
                                className="block px-4 py-2 hover:bg-indigo-500 transition"
                            >
                                Sair
                            </div>

                        }




                    </div>
                )}

                <button
                    onClick={() => {
                        logout();
                        navigate("/login");
                    }}
                    className="flex items-center gap-2 hover:text-red-500 transition text-sm"
                >
                    <FaSignOutAlt /> Sair
                </button>
            </div>
        </header>
    );
};

export default Header;
