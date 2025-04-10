import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../header/Header";
import { useNavigate } from "react-router-dom";

const Appointment = () => {
    const [agendamentos, setAgendamentos] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAgendamentos = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `https://localhost:7032/api/WeeklySchedule/available-slots?date=${selectedDate}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setAgendamentos(response.data);
            } catch (error) {
                console.error("Erro ao buscar agendamentos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAgendamentos();
    }, [selectedDate]);

    const handleHorarioClick = (horario: string) => {
        const dataHoraCompleta = `${selectedDate}T${horario}`;
        navigate("/ConfirmarHorario", {
            state: { dateTime: dataHoraCompleta }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center px-4 py-10">
                <div className="w-full max-w-5xl flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h2 className="text-3xl font-bold">Agendamentos</h2>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-gray-700 text-white text-sm px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-white">Horários Disponíveis</h3>
                        {loading ? (
                            <p className="text-gray-300">Carregando horários...</p>
                        ) : agendamentos.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {agendamentos.map((item, index) => {
                                    const hora = item.substring(11, 16);
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleHorarioClick(hora)}
                                            className="p-4 w-full bg-gray-700 rounded-lg text-white text-center shadow-sm hover:bg-cyan-700 transition-all cursor-pointer"
                                        >
                                            <span className="text-lg font-medium">{hora}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-400">Nenhum horário disponível para a data selecionada.</p>
                        )}
                    </div>
                </div>
            </main>
            <footer className="text-center p-4 text-sm text-gray-400 bg-gray-900">
                © 2025 Barbearia Barba Negra. Todos os direitos reservados.
            </footer>
        </div>
    );
};

export default Appointment;
