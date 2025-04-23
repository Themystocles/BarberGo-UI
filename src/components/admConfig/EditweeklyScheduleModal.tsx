import React, { useState, useEffect } from "react";
import { WeeklySchedule } from "../../interfaces/WeeklySchedule";
import axios from "axios";

interface EditweeklyScheduleModalProps {
    item: WeeklySchedule;
    onClose: () => void;
}

const EditweeklyScheduleModal: React.FC<EditweeklyScheduleModalProps> = ({ item, onClose }) => {
    const [startTime, setStartTime] = useState(item.startTime);
    const [endTime, setEndTime] = useState(item.endTime);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Função para formatar o horário
    const formatTime = (time: string): string => {
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}:00`; // Formato TimeSpan: 'HH:mm:ss'
    };

    // Função para atualizar o horário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(null);

        const updatedSchedule = {
            dayOfWeek: item.dayOfWeek,
            startTime: formatTime(startTime),
            endTime: formatTime(endTime),
            intervalMinutes: item.intervalMinutes,
        };

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Token de autenticação não encontrado.");
                return;
            }

            const response = await axios.put(
                `https://localhost:7032/api/WeeklySchedule/updateOv/${item.id}`,
                updatedSchedule,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                onClose();
                alert("Horário atualizado com sucesso!");
            }
        } catch (error: any) {
            setErrorMessage(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    // Função para deletar o horário
    const handleDelete = async () => {
        if (window.confirm("Você tem certeza que deseja excluir esse horário?")) {
            setLoading(true);
            setErrorMessage(null);

            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("Token de autenticação não encontrado.");
                    return;
                }

                const response = await axios.delete(
                    `https://localhost:7032/api/WeeklySchedule/delete/${item.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200) {
                    onClose();
                    alert("Horário deletado com sucesso!");
                }
            } catch (error: any) {
                setErrorMessage(error?.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-gray-800 p-6 rounded-xl w-96 shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-indigo-500">Editar Horário</h2>

                {errorMessage && (
                    <div className="mb-4 p-2 text-red-600 bg-red-100 border border-red-300 rounded">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-300">
                            Hora de Início
                        </label>
                        <input
                            type="time"
                            id="startTime"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 text-white"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-300">
                            Hora de Término
                        </label>
                        <input
                            type="time"
                            id="endTime"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 text-white"
                        />
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-4">
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-4 py-2 ${loading ? 'bg-gray-500' : 'bg-indigo-600'} text-white rounded-md hover:bg-indigo-700`}
                            >
                                {loading ? 'Atualizando...' : 'Atualizar'}
                            </button>
                        </div>

                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Deletar
                        </button>
                    </div>
                </form>


            </div>
        </div>
    );
};

export default EditweeklyScheduleModal;
