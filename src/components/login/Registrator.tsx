import { useState } from "react";
import axios from "axios";
import { IAppUser } from "../../interfaces/AppUser.tsx";
import { Link } from "react-router-dom";

export default function UserRegistration() {
    const [user, setUser] = useState<IAppUser>({
        name: "",
        email: "",
        phone: "",
        passwordHash: "",
        googleId: "",
        profilePictureUrl: "",
        createdAt: new Date().toISOString(),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("https://localhost:7032/api/AppUser/create", user);
            alert("Usuário cadastrado com sucesso!");
        } catch (error) {
            alert("Erro ao cadastrar usuário");
            console.error(error);
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

                {/* Formulário de cadastro à direita */}
                <div className="w-1/2 p-10">
                    <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">Criar Conta</h2>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-gray-700">Nome</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Digite seu nome"
                                className="w-full p-4 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                                value={user.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Digite seu e-mail"
                                className="w-full p-4 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                                value={user.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Telefone</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Digite seu telefone"
                                className="w-full p-4 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={user.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Senha</label>
                            <input
                                type="password"
                                name="passwordHash"
                                placeholder="Digite sua senha"
                                className="w-full p-4 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                                value={user.passwordHash}
                                onChange={handleChange}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Cadastrar
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-600 mt-6">
                        Já tem uma conta? {" "}
                        <Link to="/login" className="text-indigo-600 hover:underline">
                            Faça login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}