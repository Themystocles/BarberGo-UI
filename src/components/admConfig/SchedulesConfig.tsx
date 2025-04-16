import React, { useState } from "react";
import axios from "axios";
import { WeeklySchedule } from "../../interfaces/WeeklySchedule";

const SchedulesConfig = () => {
    const [formData, setFormData] = useState<Omit<WeeklySchedule, "id" | "barber">>({
        dayOfWeek: 0,
        startTime: "",
        endTime: "",
        intervalMinutes: 0,
        barberId: undefined,
    });

    const [mensagem, setMensagem] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "intervalMinutes" || name === "dayOfWeek" || name === "barberId"
                ? Number(value)
                : `${value}:00`,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post("https://localhost:7032/api/WeeklySchedule/create-weekly", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMensagem("Horário cadastrado com sucesso!");
        } catch (error) {
            console.error("Erro ao cadastrar horário:", error);
            setMensagem("Erro ao cadastrar.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white flex flex-col items-center justify-center px-4">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-xl">
                <h2 className="text-3xl font-bold text-center mb-6">Cadastrar Horário</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-1 font-medium">Dia da semana</label>
                        <select
                            name="dayOfWeek"
                            value={formData.dayOfWeek}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value={0}>Domingo</option>
                            <option value={1}>Segunda</option>
                            <option value={2}>Terça</option>
                            <option value={3}>Quarta</option>
                            <option value={4}>Quinta</option>
                            <option value={5}>Sexta</option>
                            <option value={6}>Sábado</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Início</label>
                        <input
                            type="time"
                            name="startTime"
                            value={formData.startTime.replace(":00", "")}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Fim</label>
                        <input
                            type="time"
                            name="endTime"
                            value={formData.endTime.replace(":00", "")}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Intervalo (min)</label>
                        <input
                            type="number"
                            name="intervalMinutes"
                            value={formData.intervalMinutes}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">ID do Barbeiro (opcional)</label>
                        <input
                            type="number"
                            name="barberId"
                            value={formData.barberId ?? ""}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold py-2 px-4 rounded-lg shadow-md"
                    >
                        Cadastrar
                    </button>
                </form>

                {mensagem && (
                    <p className="mt-4 text-center font-medium text-green-400">
                        {mensagem}
                    </p>
                )}
            </div>
        </div>
    );
};

export default SchedulesConfig;
