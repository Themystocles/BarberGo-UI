import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Header from "../header/Header";
import { useNavigate, useLocation } from "react-router-dom";
import { IAppUser } from "../../interfaces/AppUser";
import { AlertCircle } from "lucide-react";
import { CustomizationContext } from "../../context/CustomizationContext";

const Appointment = () => {
    const location = useLocation();
    const { barberId } = location.state || {};
    const [agendamentos, setAgendamentos] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    const [barber, setBarber] = useState<number | undefined>();
    const [barbersList, setBarbersList] = useState<{ id: number; name: string }[]>([]);
    const [idUser, setIdUser] = useState<IAppUser | any>();
    const selectedBarber = barbersList.find((b) => b.id === barber);
    const { customization } = useContext(CustomizationContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (barberId && barbersList.length > 0) {
            setBarber(barberId);
        }
    }, [barberId, barbersList]);

    useEffect(() => {
        const fetchBarbers = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    "https://barbergo-api.onrender.com/api/WeeklySchedule/barbers",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setBarbersList(response.data);
            } catch (error) {
                console.error("Erro ao buscar barbeiros:", error);
            }
        };

        fetchBarbers();
    }, []);

    useEffect(() => {
        const fetchAgendamentos = async () => {
            if (!barber) {
                setAgendamentos([]);
                return;
            }

            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `https://barbergo-api.onrender.com/api/WeeklySchedule/available-slots?date=${selectedDate}&barberId=${barber}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const user = await axios.get("https://barbergo-api.onrender.com/api/AppUser/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setIdUser(user.data.id);
                setAgendamentos(response.data);
            } catch (error) {
                console.error("Erro ao buscar agendamentos:", error);
                setAgendamentos([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAgendamentos();
    }, [selectedDate, barber]);

    const handleHorarioClick = (horario: string) => {
        const dataHoraCompleta = `${selectedDate}T${horario}`;
        navigate("/ConfirmarHorario", {
            state: {
                dateTime: dataHoraCompleta,
                barberId: barber,
                barbername: selectedBarber?.name ?? "",
                userId: idUser,
            },
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-r text-white flex flex-col" style={{ backgroundColor: customization.backgroundColor }}>
            <Header />
            <main className="flex-1 flex flex-col items-center px-4 py-10">
                <div className="w-full max-w-5xl flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h2 className="text-3xl font-bold">Agendamentos</h2>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <select
                                value={barber ?? ""}
                                onChange={(e) => setBarber(Number(e.target.value))}
                                required
                                className="bg-gray-700 text-white text-sm px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            >
                                <option value="">Selecione um barbeiro</option>
                                {barbersList.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                                className="bg-gray-700 text-white text-sm px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            />
                        </div>
                    </div>

                    {!barber && (
                        <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded-md flex items-center gap-2 animate-pulse border border-yellow-300">
                            <AlertCircle className="w-5 h-5" />
                            <p className="text-sm font-medium">
                                Selecione um barbeiro para visualizar os horários disponíveis.
                            </p>
                        </div>
                    )}

                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-white">
                            Horários Disponíveis
                        </h3>

                        {!barber ? (
                            <p className="text-gray-400">
                                Selecione um barbeiro para ver os horários disponíveis.
                            </p>
                        ) : loading ? (
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
                            <p className="text-gray-400">
                                Nenhum horário disponível para a data e barbeiro selecionados.
                            </p>
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
