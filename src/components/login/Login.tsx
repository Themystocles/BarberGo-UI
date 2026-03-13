import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useUserContext } from "../../context/UserContext";
import { CustomizationContext } from "../../context/CustomizationContext";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { Haircut } from "../../interfaces/Haircut";

const LoginResponsive = () => {
    const { login, error, successMessage } = useAuth();
    const { refreshUser } = useUserContext();
    const { customization } = useContext(CustomizationContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [haircuts, setHaircuts] = useState<Haircut[]>([]);

    useEffect(() => {
        const fetchHaircuts = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    "https://barbergo-api.onrender.com/api/Haircuts",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setHaircuts(res.data);
            } catch (e) {
                console.error("Erro ao buscar cortes", e);
            }
        };
        fetchHaircuts();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const success = await login(email, password);
        if (success) {
            await refreshUser();
            navigate("/home");
        } else {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        const googleLoginUrl = "https://barbergo-api.onrender.com/auth/google-login";
        const width = 500;
        const height = 600;
        const left = window.innerWidth / 2 - width / 2;
        const top = window.innerHeight / 2 - height / 2;
        const popup = window.open(
            googleLoginUrl,
            "Login Google",
            `width=${width},height=${height},top=${top},left=${left}`
        );

        const timer = setInterval(() => {
            if (popup && popup.closed) {
                clearInterval(timer);
                const token = localStorage.getItem("token");
                if (token) {
                    refreshUser();
                    navigate("/home");
                }
            }
        }, 500);
    };

    const renderHaircuts = () => {
        if (haircuts.length === 0) return <p className="text-gray-300">Carregando cortes...</p>;

        const loop = [...haircuts, ...haircuts];

        return (
            <div className="overflow-hidden w-full mt-6">
                <div className="flex gap-4 animate-scroll">
                    {loop.map((h, index) => (
                        <div
                            key={index}
                            className="min-w-[140px] backdrop-blur-xl bg-white/10 border border-white/10 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition"
                            title={`${h.name} - R$ ${h.preco.toFixed(2)}`}
                        >
                            <img src={h.imagePath} alt={h.name} className="w-full h-32 object-cover" />
                            <div className="p-2 text-center">
                                <h3 className="text-sm font-semibold truncate">{h.name}</h3>
                                <p className="text-xs font-bold" style={{ color: customization?.corSecundaria }}>
                                    R$ {h.preco.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: scroll 35s linear infinite;
            display: flex;
          }
        `}</style>
            </div>
        );
    };

    return (
        <div
            className="min-h-screen w-full flex flex-col lg:flex-row bg-cover bg-center relative"
            style={{ backgroundImage: `url(${customization?.backgroundUrl})` }}
        >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* ShowCase */}
            <div className="relative z-10 lg:w-2/3 flex flex-col justify-center items-center lg:items-start p-6 lg:p-16 text-white">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-center lg:text-left">
                    <span className="text-white">Bem-vindo ao </span>
                    <br className="lg:hidden" />
                    <span style={{ color: customization?.corSecundaria }}>
                        {customization?.nomeSistema || "BarbeGo"}
                    </span>
                </h1>

                <p className="text-gray-300 mt-4 max-w-lg text-center lg:text-left text-lg">
                    Gerencie clientes, agendamentos e serviços com um sistema moderno e eficiente para sua
                    barbearia.
                </p>

                {renderHaircuts()}
            </div>

            {/* Login Card */}
            <div className="relative z-10 lg:w-1/3 flex items-center justify-center p-6">
                <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl shadow-2xl p-8 text-white">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Bem-vindo de volta</h2>

                    {error && (
                        <p className="text-red-400 text-center mb-3 font-semibold">{error}</p>
                    )}
                    {successMessage && (
                        <p className="text-green-400 text-center mb-3 font-semibold">{successMessage}</p>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Digite seu e-mail"
                            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 rounded-lg font-semibold transition hover:scale-[1.02]"
                            style={{ backgroundColor: customization?.corSecundaria }}
                        >
                            {isLoading ? "Entrando..." : "Entrar"}
                        </button>
                    </form>

                    <button
                        onClick={handleGoogleLogin}
                        className="mt-4 w-full flex items-center justify-center gap-3 border border-white/20 rounded-lg p-3 text-white hover:bg-white/10 transition"
                    >
                        <FcGoogle size={22} /> Entrar com Google
                    </button>

                    <div className="text-center mt-4 text-sm text-gray-300">
                        <p>
                            Não tem conta?{" "}
                            <Link
                                to="/registration"
                                className="font-semibold"
                                style={{ color: customization?.corSecundaria }}
                            >
                                Cadastre-se
                            </Link>
                        </p>
                        <p className="mt-1">
                            Esqueceu a senha?{" "}
                            <Link
                                to="/Recuperar-Senha"
                                className="font-semibold"
                                style={{ color: customization?.corSecundaria }}
                            >
                                Recuperar senha
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginResponsive;