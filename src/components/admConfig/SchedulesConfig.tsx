import React, { useState } from "react";
import axios from "axios";
import { WeeklySchedule } from "../../interfaces/WeeklySchedule";
import { IAppUser } from "../../interfaces/AppUser";

const SchedulesConfig = () => {
    const [barberId, setBarberId] = useState<IAppUser>();
    const [formData, setFormData] = useState<Omit<WeeklySchedule, "id" | "barber">>({
        dayOfWeek: 0,
        startTime: "",
        endTime: "",
        intervalMinutes: 0,
        barberId: barberId?.id,
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
        setMensagem(""); // limpa mensagem anterior
        try {
            const token = localStorage.getItem("token");
            const responseUser = await axios.get("https://localhost:7032/api/AppUser/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },

            });
            const user = responseUser.data;
            setBarberId(user);

            const updatedFormData = {
                ...formData,
                barberId: user.id,
            };


            const response = await axios.post(
                "https://localhost:7032/api/WeeklySchedule/create-weekly",
                updatedFormData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    validateStatus: status => status < 500
                }
            );



            if (response.status === 200 || response.status === 201) {
                setMensagem("Horário cadastrado com sucesso!");
            } else {
                setMensagem(response.data?.message || "Erro ao cadastrar.");
            }

        } catch (error: any) {
            console.error("Erro ao cadastrar horário:", error);
            if (axios.isAxiosError(error) && error.response) {
                setMensagem(error.response.data?.message || "Erro de validação.");
            } else {
                setMensagem("Erro ao cadastrar.");
            }
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
