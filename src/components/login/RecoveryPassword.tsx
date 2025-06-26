import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RecoveryPassword: React.FC = () => {
    const [step, setStep] = useState<"email" | "reset">("email");
    const [email, setEmail] = useState("");
    const [codigo, setCodigo] = useState(Array(6).fill(""));
    const [novaSenha, setNovaSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [sucesso, setSucesso] = useState(false);
    const navigate = useNavigate();

    const inputsRef = useRef<HTMLInputElement[]>([]);

    const handleEnviarCodigo = async () => {
        setCarregando(true);
        try {
            await axios.get(`https://barbergo-api.onrender.com/recoveryPassword/${email}`);
            setMensagem("Código enviado para o e-mail.");
            setStep("reset");
        } catch {
            setMensagem("Erro ao enviar código. Verifique o e-mail informado.");
        } finally {
            setCarregando(false);
        }
    };

    const handleRedefinirSenha = async () => {
        setCarregando(true);

        if (!novaSenha || novaSenha.length < 6) {
            setMensagem("Digite uma nova senha válida (mínimo 6 caracteres).");
            setCarregando(false);
            return;
        }

        try {
            const codigoFinal = codigo.join("");
            const response = await axios.post(
                "https://barbergo-api.onrender.com/redefinir-senha",
                {
                    email,
                    codigo: codigoFinal,
                    novaSenha,
                }
            );
            setMensagem(response.data.message || "Senha redefinida com sucesso.");
            setSucesso(true);
        } catch (error: any) {
            setMensagem(
                error?.response?.data?.message || "Erro ao redefinir a senha."
            );
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        if (sucesso) {
            const timer = setTimeout(() => {
                navigate("/login");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [sucesso, navigate]);

    const handleCodigoChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const novoCodigo = [...codigo];
        novoCodigo[index] = value;
        setCodigo(novoCodigo);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 p-4">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl p-8 md:p-10">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
                    Recuperar Senha
                </h2>

                {mensagem && (
                    <div
                        className={`text-center mb-4 p-3 rounded-lg ${sucesso
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                    >
                        {mensagem}
                    </div>
                )}

                {step === "email" ? (
                    <div className="space-y-5">
                        <div>
                            <label className="block text-gray-700">E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Digite seu e-mail"
                                className="w-full p-2 border rounded bg-gray-100 text-gray-800"
                            />
                        </div>

                        <button
                            onClick={handleEnviarCodigo}
                            disabled={carregando}
                            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {carregando ? "Enviando..." : "Enviar código"}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-5">
                        <div>
                            <label className="block text-gray-700 mb-2">
                                Código recebido (6 dígitos):
                            </label>
                            <div className="flex justify-between gap-2">
                                {codigo.map((valor, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => {
                                            if (el) inputsRef.current[i] = el;
                                        }}
                                        type="text"
                                        maxLength={1}
                                        value={valor}
                                        onChange={(e) => handleCodigoChange(i, e.target.value)}
                                        className="w-12 h-12 text-center text-xl border rounded bg-gray-100 text-gray-800"
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700">Nova senha</label>
                            <input
                                type="password"
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                                placeholder="Digite a nova senha"
                                className="w-full p-2 border rounded bg-gray-100 text-gray-800"
                            />
                        </div>

                        {carregando && (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-5 h-5 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-indigo-600 font-semibold">
                                    {sucesso ? "Redirecionando..." : "Processando..."}
                                </span>
                            </div>
                        )}

                        <button
                            onClick={handleRedefinirSenha}
                            disabled={
                                carregando || sucesso || novaSenha.trim().length < 6
                            }
                            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sucesso ? "Sucesso" : "Redefinir Senha"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecoveryPassword;
