import axios from "axios";
import { useEffect, useState } from "react";
import { IMyAppointments } from "../../interfaces/IMyAppointments";
import Header from "../header/Header";
import { useNavigate } from "react-router-dom";

const MyAppointments = () => {
    const [appointments, setAppointments] = useState<IMyAppointments[]>([]);
    const [loading, setLoading] = useState(true); // 👈 Novo estado
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                const responseUser = await axios.get("https://barbergo-api.onrender.com/api/AppUser/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                const user = responseUser.data;

                const responseAppointment = await axios.get(`https://barbergo-api.onrender.com/api/Appointment/appointments/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                setAppointments(responseAppointment.data);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setLoading(false); // 👈 Finaliza carregamento
            }
        };

        fetchData();
    }, []);

    const deleteAppointment = async (id: number) => {
        const confirm = window.confirm("Tem certeza que deseja cancelar este agendamento?");
        if (!confirm) return;

        const token = localStorage.getItem("token");

        await axios.delete(`https://barbergo-api.onrender.com/api/Appointment/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        setAppointments((prev) => prev.filter((a) => a.id !== id));
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center text-white"
            style={{
                backgroundImage: "url('https://i.pinimg.com/originals/19/26/6e/19266e1b4e9597fc43dc5cb056d3100b.jpg')",
            }}
        >
            <div className="bg-black bg-opacity-60 min-h-screen">
                <Header />

                <div className="max-w-4xl mx-auto py-10 px-4">
                    <h1 className="text-3xl font-semibold text-center mb-6 text-white">Meus Agendamentos</h1>

                    {/* Avisos */}
                    <div className="bg-yellow-900 bg-opacity-70 text-yellow-200 p-4 rounded-xl mb-8 border border-yellow-600 shadow">
                        <h2 className="text-xl font-bold mb-2">⚠️ Regras da Barbearia</h2>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Chegue com 20 minutos de antecedência.</li>
                            <li>Tolerância máxima de 15 minutos de atraso.</li>
                            <li>Após esse tempo, o agendamento poderá ser cancelado automaticamente.</li>
                        </ul>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-[60vh]">
                            <svg
                                className="animate-spin h-12 w-12 text-cyan-400"
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
                    ) : appointments.length === 0 ? (
                        <p className="text-center text-gray-300 mb-6">Nenhum agendamento encontrado.</p>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-full max-w-2xl">
                                {appointments.map((a) => (
                                    <div key={a.id} className="bg-gray-800 shadow-xl rounded-2xl p-6 mb-6 border border-gray-600">
                                        <p className="mb-1"><span className="font-semibold text-white">Cliente:</span> {a.clientName}</p>
                                        <p className="mb-1"><span className="font-semibold text-white">Corte:</span> {a.haircutName}</p>
                                        <p className="mb-1"><span className="font-semibold text-white">Barbeiro:</span> {a.barberName}</p>
                                        <p className="mb-1"><span className="font-semibold text-white">Data e Hora:</span> {new Date(a.dateTime).toLocaleString("pt-BR")}</p>
                                        <p className="mb-4">
                                            <span className="font-semibold text-white">Status:</span>{" "}
                                            <span className={`font-semibold ${a.status === 'Confirmado' ? 'text-green-400' : 'text-yellow-400'}`}>
                                                {a.status}
                                            </span>
                                        </p>
                                        <button
                                            onClick={() => deleteAppointment(a.id)}
                                            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition duration-300"
                                        >
                                            Cancelar Agendamento
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Botão de histórico */}
                    {!loading && (
                        <div className="text-center mt-10">
                            <button
                                onClick={() => navigate("/historico")}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-300"
                            >
                                Consultar histórico de agendamentos
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <footer className="text-center p-4 text-sm text-gray-400 bg-gray-900 bg-opacity-90">
                © 2025 Barbearia Barba Negra. Todos os direitos reservados.
            </footer>
        </div>
    );
};

export default MyAppointments;
