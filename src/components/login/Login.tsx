import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useUserContext } from "../../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { Haircut } from "../../interfaces/Haircut";

const LoginWithShowcase = () => {
    const { login, error, successMessage } = useAuth();
    const { refreshUser } = useUserContext();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [haircuts, setHaircuts] = useState<Haircut[]>([]);

    useEffect(() => {
        document.body.style.overflow = "hidden"; // bloqueia scroll vertical na página de login
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

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
                // Se der erro (ex: não logado), não faz nada
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
            setTimeout(() => navigate("/home"), 2000);
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
            "Login com Google",
            `width=${width},height=${height},top=${top},left=${left}`
        );

        const timer = setInterval(() => {
            if (popup && popup.closed) {
                clearInterval(timer);
                const token = localStorage.getItem("token");
                if (token) {
                    refreshUser();
                    navigate("/home");
                } else {
                    alert("Falha no login com Google");
                }
            }
        }, 500);
    };

    return (
        <div className="flex min-h-screen">
            {/* === Lado esquerdo desktop (imagem + cortes) === */}
            <div className="relative hidden md:flex md:w-1/2 h-screen flex-col">
                <img
                    src="https://d2zdpiztbgorvt.cloudfront.net/region1/br/293956/biz_photo/394459b035ce4205a0ddb43a053874-barbearia-barba-negra-biz-photo-567f5ccdfb0a401690edd11f14ad92-booksy.jpeg"
                    alt="Barbearia Barba Negra"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>

                <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full h-full">
                    <div>
                        <h1 className="text-4xl font-extrabold mb-6 drop-shadow-lg">
                            Barbearia Barba Negra
                        </h1>
                        <p className="text-lg max-w-lg leading-relaxed drop-shadow mb-8">
                            Ambiente acolhedor, profissionais experientes e os melhores cortes para realçar seu estilo.
                            Explore nossos cortes abaixo e prepare-se para uma experiência única.
                        </p>
                    </div>

                    {/* Título da seção cortes */}
                    <div>
                        <h2 className="text-3xl font-bold mb-4 drop-shadow">Nossos Cortes</h2>
                        <p className="mb-6 max-w-md drop-shadow text-indigo-300">
                            Confira alguns dos cortes que oferecemos e escolha seu favorito!
                        </p>

                        <div className="flex flex-wrap gap-4 max-w-xl">
                            {haircuts.length === 0 && (
                                <p className="text-gray-300">Carregando cortes...</p>
                            )}
                            {haircuts.map((h) => (
                                <div
                                    key={h.id}
                                    className="bg-gray-900 bg-opacity-70 rounded-lg overflow-hidden w-32 cursor-default shadow-lg transform hover:scale-105 transition-transform"
                                    title={`${h.name} - R$ ${h.preco.toFixed(2)}`}
                                >
                                    <img
                                        src={h.imagePath}
                                        alt={h.name}
                                        className="w-full h-20 object-cover"
                                        loading="lazy"
                                    />
                                    <div className="p-2 text-center">
                                        <h3 className="text-sm font-semibold truncate">{h.name}</h3>
                                        <p className="text-xs text-indigo-400">R$ {h.preco.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* === Lado direito desktop (formulário) === */}
            <div className="hidden md:flex md:w-1/2 justify-center items-center bg-white min-h-screen p-8">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
                        Bem-vindo de volta
                    </h2>

                    {error && (
                        <p className="text-red-600 text-center mb-4 font-semibold">{error}</p>
                    )}
                    {successMessage && (
                        <p className="text-green-600 text-center mb-4 font-semibold">
                            {successMessage}
                        </p>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-gray-700 font-semibold mb-2"
                            >
                                E-mail
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Digite seu e-mail"
                                className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="username"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-gray-700 font-semibold mb-2"
                            >
                                Senha
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Digite sua senha"
                                className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            {isLoading ? "Entrando..." : "Entrar"}
                        </button>
                    </form>

                    <div className="mt-6">
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-2 border border-blue-600 rounded-lg px-4 py-2 text-blue-600 bg-white hover:bg-blue-600 hover:text-white transition"
                        >
                            <FcGoogle size={24} />
                            Entrar com Google
                        </button>
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Não tem uma conta?{" "}
                        <Link
                            to="/registration"
                            className="text-indigo-600 font-semibold hover:underline"
                        >
                            Cadastre-se
                        </Link>
                    </p>
                </div>
            </div>

            {/* === Versão mobile - imagem + resumo + cortes + formulário === */}
            <div className="md:hidden w-full bg-white flex flex-col min-h-screen overflow-y-scroll">



                <div className="relative h-80 w-full">
                    <img
                        src="https://d2zdpiztbgorvt.cloudfront.net/region1/br/293956/biz_photo/394459b035ce4205a0ddb43a053874-barbearia-barba-negra-biz-photo-567f5ccdfb0a401690edd11f14ad92-booksy.jpeg"
                        alt="Barbearia Barba Negra"
                        className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                    <div className="relative z-10 p-4 text-white flex flex-col justify-center h-full">
                        <h1 className="text-3xl font-bold drop-shadow mb-2">Barbearia Barba Negra</h1>
                        <p className="text-sm drop-shadow max-w-xs leading-snug">
                            Ambiente acolhedor, profissionais experientes e os melhores cortes para realçar seu estilo.
                        </p>
                    </div>
                </div>

                <section className="p-4">
                    <h2 className="text-xl font-bold mb-2">Nossos Cortes</h2>
                    <p className="mb-4 text-gray-600 max-w-md">
                        Confira alguns dos cortes que oferecemos e escolha seu favorito!
                    </p>

                    <div className="flex overflow-x-auto gap-4 pb-4">
                        {haircuts.length === 0 && (
                            <p className="text-gray-500 whitespace-nowrap">Carregando cortes...</p>
                        )}
                        {haircuts.map((h) => (
                            <div
                                key={h.id}
                                className="min-w-[120px] bg-gray-100 rounded-lg overflow-hidden cursor-default shadow-md flex-shrink-0"
                                title={`${h.name} - R$ ${h.preco.toFixed(2)}`}
                            >
                                <img
                                    src={h.imagePath}
                                    alt={h.name}
                                    className="w-full h-24 object-cover"
                                    loading="lazy"
                                />
                                <div className="p-2 text-center">
                                    <h3 className="text-sm font-semibold truncate">{h.name}</h3>
                                    <p className="text-xs text-indigo-600">R$ {h.preco.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Formulário */}
                <div className="flex flex-col justify-center items-center p-6">
                    <div className="w-full max-w-md">
                        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
                            Bem-vindo de volta
                        </h2>

                        {error && (
                            <p className="text-red-600 text-center mb-4 font-semibold">{error}</p>
                        )}
                        {successMessage && (
                            <p className="text-green-600 text-center mb-4 font-semibold">
                                {successMessage}
                            </p>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-gray-700 font-semibold mb-2"
                                >
                                    E-mail
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Digite seu e-mail"
                                    className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="username"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-gray-700 font-semibold mb-2"
                                >
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Digite sua senha"
                                    className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                {isLoading ? "Entrando..." : "Entrar"}
                            </button>
                        </form>

                        <div className="mt-6">
                            <button
                                onClick={handleGoogleLogin}
                                className="w-full flex items-center justify-center gap-2 border border-blue-600 rounded-lg px-4 py-2 text-blue-600 bg-white hover:bg-blue-600 hover:text-white transition"
                            >
                                <FcGoogle size={24} />
                                Entrar com Google
                            </button>
                        </div>

                        <p className="mt-6 text-center text-sm text-gray-600">
                            Não tem uma conta?{" "}
                            <Link
                                to="/registration"
                                className="text-indigo-600 font-semibold hover:underline"
                            >
                                Cadastre-se
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>

    );

};

export default LoginWithShowcase;
