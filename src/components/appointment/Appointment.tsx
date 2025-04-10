import React, { useEffect, useState } from "react";
import axios from "axios";
import { IAppointment } from "../../interfaces/Appointment";
import { FaPlus } from "react-icons/fa";
import Header from "../header/Header";

const Appointment = () => {
    const [agendamentos, setAgendamentos] = useState<IAppointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAgendamentos = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("https://localhost:7032/api/Appointment/Agendamentos");
                setAgendamentos(response.data);
            } catch (error) {
                console.error("Erro ao buscar agendamentos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAgendamentos();
    }, []);

    // Filtrar agendamentos do dia
    const today = new Date().toISOString().split("T")[0];
    const agendamentosHoje = agendamentos.filter(a => a.dateTime.startsWith(today));

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white flex flex-col">
            <Header />

            <main className="flex-1 flex flex-col items-center px-4 py-8">
                <div className="flex justify-between items-center w-full max-w-4xl mb-6">
                    <h2 className="text-3xl font-bold">Agendamentos de Hoje</h2>
                    <button
                        className="flex items-center bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-xl"
                        onClick={() => alert("Abrir modal ou redirecionar para novo agendamento")}
                    >
                        <FaPlus className="mr-2" />
                        Novo Agendamento
                    </button>
                </div>

                {loading ? (
                    <p className="text-gray-300">Carregando agendamentos...</p>
                ) : agendamentosHoje.length === 0 ? (
                    <p className="text-gray-400">Nenhum agendamento para hoje.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
                        {agendamentosHoje.map((agendamento, idx) => (
                            <div key={idx} className="bg-gray-700 p-4 rounded-xl shadow-md">
                                <h3 className="text-xl font-semibold">Cliente ID: {agendamento.clientId}</h3>
                                <p className="text-sm text-gray-300">Barbeiro ID: {agendamento.barberId}</p>
                                <p className="text-sm text-gray-300">Serviço ID: {agendamento.haircutId}</p>
                                <p className="text-sm text-gray-300 mt-2">
                                    Horário: {new Date(agendamento.dateTime).toLocaleTimeString("pt-BR")}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">Status: {agendamento.status}</p>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer className="text-center p-4 text-sm text-gray-400 bg-gray-900">
                © 2025 Barbearia Barba Negra. Todos os direitos reservados.
            </footer>
        </div>
    );
};

export default Appointment;
