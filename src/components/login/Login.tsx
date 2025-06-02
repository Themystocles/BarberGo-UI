import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
    const { login, error, successMessage } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const isSuccessful = await login(email, password);
        if (isSuccessful) {
            setTimeout(() => {
                navigate("/Home");
            }, 2000);
        } else {
            setIsLoading(false);
        }
    };

    // Função simples para abrir popup do login Google
    const handleGoogleLogin = () => {
        // URL da API que inicia o login com Google e redireciona para o consentimento Google
        const googleLoginUrl = "https://barbergo-api.onrender.com/auth/google-login";

        const width = 500;
        const height = 600;
        const left = window.innerWidth / 2 - width / 2;
        const top = window.innerHeight / 2 - height / 2;

        // Abrir popup centralizada
        const popup = window.open(
            googleLoginUrl,
            "Login com Google",
            `width=${width},height=${height},top=${top},left=${left}`
        );

        // Aqui você pode usar setInterval para ficar verificando se o popup foi fechado
        const timer = setInterval(() => {
            if (popup && popup.closed) {
                clearInterval(timer);
                // A popup fechou, então pode buscar o token armazenado (exemplo localStorage)
                const token = localStorage.getItem("token"); // ou de onde você armazena
                if (token) {
                    // Atualiza seu contexto/auth state com o token
                    // Depois redireciona para home
                    navigate("/home");
                } else {
                    alert("Falha no login com Google");
                }
            }
        }, 500);
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 px-4">
            <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-lg shadow-2xl overflow-hidden">
                {/* Foto à esquerda */}
                <div className="w-full md:w-1/2 relative h-64 md:h-auto">
                    <img
                        src="https://d2zdpiztbgorvt.cloudfront.net/region1/br/293956/biz_photo/394459b035ce4205a0ddb43a053874-barbearia-barba-negra-biz-photo-567f5ccdfb0a401690edd11f14ad92-booksy.jpeg"
                        alt="Imagem de barbearia"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-40 md:rounded-l-lg"></div>
                </div>

                {/* Formulário de login à direita */}
                <div className="w-full md:w-1/2 p-6 md:p-10">
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-800 text-center mb-6">
                        Bem-vindo de volta
                    </h2>

                    {error && <p className="text-red-600 text-center">{error}</p>}
                    {successMessage && (
                        <p className="text-green-600 text-center">{successMessage}</p>
                    )}

                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-gray-700">
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
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-gray-700">
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
                            />
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-indigo-600"></div>
                            </div>
                        ) : (
                            <button
                                type="submit"
                                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Entrar
                            </button>
                        )}
                    </form>

                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            type="button"
                            className="flex items-center gap-3 px-5 py-3 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white text-gray-700 font-semibold hover:bg-gray-50"
                        >
                            <FcGoogle size={24} />
                            Entrar com Google
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-600 mt-6">
                        Não tem uma conta?{" "}
                        <Link to="/registration" className="text-indigo-600 hover:underline">
                            Cadastre-se
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
