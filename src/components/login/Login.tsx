import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";



const Login = () => {
    const { login, error, successMessage } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");



    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isSuccessful = await login(email, password);
        if (isSuccessful) {
            setTimeout(() => {
                navigate("/teste");
            }, 2000);
        }
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-900">
            <div className="flex w-full max-w-6xl bg-white rounded-lg shadow-2xl overflow-hidden">
                {/* Foto à esquerda */}
                <div className="w-1/2 relative">
                    <img
                        src="https://d2zdpiztbgorvt.cloudfront.net/region1/br/293956/biz_photo/394459b035ce4205a0ddb43a053874-barbearia-barba-negra-biz-photo-567f5ccdfb0a401690edd11f14ad92-booksy.jpeg"
                        alt="Imagem de barbearia"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-40 rounded-lg"></div>
                </div>

                {/* Formulário de login à direita */}
                <div className="w-1/2 p-10">
                    <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">Bem-vindo de volta</h2>

                    {/* Mensagem de erro */}
                    {error && <p className="text-red-600 text-center">{error}</p>}

                    {/* Mensagem de sucesso */}
                    {successMessage && <p className="text-green-600 text-center">{successMessage}</p>}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-gray-700">
                                E-mail
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Digite seu e-mail"
                                className="w-full p-4 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                                className="w-full p-4 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Entrar
                        </button>
                    </form>

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
};

export default Login;
