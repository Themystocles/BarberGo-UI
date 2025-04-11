import React, { useState } from "react";
import axios from "axios";
import Header from "../header/Header";
import { useLocation, useNavigate } from "react-router-dom";

const ScheduleConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const receivedDateTime = location.state?.dateTime ?? "";


    const [form, setForm] = useState({
        clientId: 0,
        haircutId: 0,
        barberId: 0,
        dateTime: receivedDateTime,
        status: "Pendente",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            await axios.post("https://localhost:7032/api/Appointment/create", form, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Agendamento confirmado com sucesso!");
            navigate("/"); // volta para home ou agenda
        } catch (error) {
            console.error("Erro ao agendar:", error);
            alert("Erro ao confirmar agendamento.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center px-4 py-10">
                <div className="w-full max-w-xl bg-gray-800 p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center">Confirmar Agendamento</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="number"
                            name="clientId"
                            placeholder="ID do Cliente"
                            value={form.clientId}
                            onChange={handleChange}
                            className="bg-gray-700 p-2 rounded border border-gray-600 text-white"
                            required
                        />
                        <input
                            type="number"
                            name="haircutId"
                            placeholder="ID do Corte"
                            value={form.haircutId}
                            onChange={handleChange}
                            className="bg-gray-700 p-2 rounded border border-gray-600 text-white"
                            required
                        />
                        <input
                            type="number"
                            name="barberId"
                            placeholder="ID do Barbeiro"
                            value={form.barberId}
                            onChange={handleChange}
                            className="bg-gray-700 p-2 rounded border border-gray-600 text-white"
                            required
                        />
                        <input
                            type="datetime-local"
                            name="dateTime"
                            value={form.dateTime}
                            onChange={handleChange}
                            className="bg-gray-700 p-2 rounded border border-gray-600 text-white"
                            required
                        />
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="bg-gray-700 p-2 rounded border border-gray-600 text-white"
                        >
                            <option value="Pendente">Pendente</option>
                            <option value="Confirmado">Confirmado</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                        <button
                            type="submit"
                            className="bg-cyan-600 hover:bg-cyan-700 transition-all text-white py-2 rounded"
                        >
                            Confirmar Agendamento
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ScheduleConfirmation;
