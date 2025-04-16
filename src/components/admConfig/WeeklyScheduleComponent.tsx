import React, { useEffect, useState } from "react";
import { WeeklySchedule } from "../../interfaces/WeeklySchedule";
import { Link } from "react-router-dom";
import { FaClock, FaEdit, FaPlus } from "react-icons/fa";
import axios from "axios";
import EditweeklyScheduleModal from "../admConfig/EditweeklyScheduleModal";

const WeeklyScheduleComponent = () => {
    const [data, setData] = useState<WeeklySchedule[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<WeeklySchedule | null>(null);
    const dayNames: Record<number, string> = {
        1: "Segunda-feira",
        2: "Terça-feira",
        3: "Quarta-feira",
        4: "Quinta-feira",
        5: "Sexta-feira",
        6: "Sábado",
        7: "Domingo",
    };

    const daysOrder = [1, 2, 3, 4, 5, 6, 7];

    useEffect(() => {
        const fetchWeeklySchedule = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("https://localhost:7032/api/WeeklySchedule", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setData(response.data);
            } catch (error) {
                console.error("Erro ao buscar horários:", error);
            }
        };

        fetchWeeklySchedule();
    }, []);

    // Função para abrir o modal com o horário selecionado
    const handleEditClick = (item: WeeklySchedule) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    // Função para fechar o modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Agenda Semanal</h2>
                <Link
                    to="/ConfiguraçãoHorarios"
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
                >
                    <FaPlus />
                    Novo Horário
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {daysOrder.map((day) => {
                    const horarios = data.filter((item) => item.dayOfWeek === day);

                    return (
                        <div
                            key={day}
                            className="bg-gray-800 rounded-xl shadow-md p-4 flex flex-col justify-between min-h-[160px]"
                        >
                            <div>
                                <h3 className="text-lg font-semibold text-indigo-400 mb-3 border-b border-indigo-500 pb-1">
                                    {dayNames[day]}
                                </h3>

                                {horarios.length > 0 ? (
                                    <ul className="space-y-2">
                                        {horarios.map((item, idx) => (
                                            <li
                                                key={idx}
                                                className="flex items-center justify-between text-sm bg-gray-700 rounded-md px-3 py-1"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <FaClock className="text-indigo-300" />
                                                    <span>{item.startTime} - {item.endTime}</span>
                                                </div>

                                                <button
                                                    className="p-1 text-indigo-400 hover:text-indigo-200 transition"
                                                    title="Editar horário"
                                                    onClick={() => handleEditClick(item)} // Abre o modal de edição
                                                    style={{ background: "transparent", border: "none", outline: "none" }}
                                                >
                                                    <FaEdit />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-400 text-sm italic">Nenhum horário definido.</p>
                                )}
                            </div>

                            <div className="mt-4 text-right">
                                <Link
                                    to="/ConfiguraçãoHorarios"
                                    className="text-indigo-400 hover:text-indigo-300 text-sm underline transition"
                                >
                                    Configurar Horários
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Exibindo o modal */}
            {showModal && selectedItem && (
                <EditweeklyScheduleModal item={selectedItem} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default WeeklyScheduleComponent;
