import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import { IAppUser } from "../../interfaces/AppUser";
import { AlertCircle } from "lucide-react";
import { CustomizationContext } from "../../context/CustomizationContext";

const Appointment = () => {
    const { customization } = useContext(CustomizationContext);
    const location = useLocation();
    const { barberId } = location.state || {};
    const navigate = useNavigate();

    const [barbersList, setBarbersList] = useState<{ id: number; name: string }[]>([]);
    const [barber, setBarber] = useState<number | undefined>(barberId);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [datesList, setDatesList] = useState<Date[]>([]);
    const [agendamentos, setAgendamentos] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [idUser, setIdUser] = useState<IAppUser | any>();

    const selectedBarber = barbersList.find((b) => b.id === barber);

    // Função para formatar data no padrão YYYY-MM-DD (local)
    const formatDateLocal = (date: Date) => {
        const ano = date.getFullYear();
        const mes = String(date.getMonth() + 1).padStart(2, "0");
        const dia = String(date.getDate()).padStart(2, "0");
        return `${ano}-${mes}-${dia}`;
    };

    // Gera 14 dias a partir de hoje
    useEffect(() => {
        const tempDates: Date[] = [];
        for (let i = 0; i < 14; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            tempDates.push(d);
        }
        setDatesList(tempDates);
    }, []);

    // Buscar barbeiros
    useEffect(() => {
        const fetchBarbers = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    "https://barbergo-api.onrender.com/api/WeeklySchedule/barbers",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setBarbersList(res.data);
            } catch (err) {
                console.error("Erro ao buscar barbeiros:", err);
            }
        };
        fetchBarbers();
    }, []);

    // Buscar horários disponíveis
    useEffect(() => {
        const fetchAgendamentos = async () => {
            if (!barber) {
                setAgendamentos([]);
                return;
            }
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                // Horários disponíveis usando data local
                const res = await axios.get(
                    `https://barbergo-api.onrender.com/api/WeeklySchedule/available-slots?date=${formatDateLocal(
                        selectedDate
                    )}&barberId=${barber}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // Dados do usuário
                const user = await axios.get("https://barbergo-api.onrender.com/api/AppUser/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIdUser(user.data.id);
                setAgendamentos(res.data);
            } catch (err) {
                console.error("Erro ao buscar horários:", err);
                setAgendamentos([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAgendamentos();
    }, [barber, selectedDate]);

    // Função para confirmar horário
    const handleHorarioClick = (horario: string) => {
        const dataHoraCompleta = `${formatDateLocal(selectedDate)}T${horario}`;

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
        <div
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: customization?.backgroundColor || "#1f1f1f" }}
        >
            <Header />

            <main className="flex-1 flex flex-col items-center px-4 py-10 w-full max-w-6xl mx-auto gap-8">

                {/* Seleção de barbeiro */}
                <select
                    value={barber ?? ""}
                    onChange={(e) => setBarber(Number(e.target.value))}
                    className="bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-full md:w-1/3"
                >
                    <option value="">Selecione um barbeiro</option>
                    {barbersList.map((b) => (
                        <option key={b.id} value={b.id}>
                            {b.name}
                        </option>
                    ))}
                </select>

                {/* Carrossel de datas */}
                <div className="w-full overflow-x-auto scrollbar-hide">
                    <div className="flex gap-3 py-2 min-w-max">
                        {datesList.map((date) => {
                            const isSelected = date.toDateString() === selectedDate.toDateString();
                            return (
                                <button
                                    key={date.toDateString()}
                                    onClick={() => setSelectedDate(date)}
                                    className="flex flex-col items-center justify-center px-4 py-3 min-w-[70px] rounded-xl border transition-all"
                                    style={{
                                        backgroundColor: isSelected
                                            ? customization?.corPrimaria || "#0ea5e9"
                                            : "#374151",
                                        borderColor: isSelected
                                            ? customization?.corPrimaria || "#0ea5e9"
                                            : "#4b5563",
                                        color: "#fff",
                                    }}
                                >
                                    <span className="text-sm font-medium">{date.toLocaleDateString("pt-BR", { weekday: "short" })}</span>
                                    <span className="font-bold text-lg">{date.getDate()}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Horários disponíveis */}
                <div className="w-full flex-1 flex flex-col gap-4">
                    <h3 className="text-2xl font-semibold text-white">Horários Disponíveis</h3>

                    {!barber ? (
                        <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded-md flex items-center gap-2 animate-pulse border border-yellow-300">
                            <AlertCircle className="w-5 h-5" />
                            <p className="text-sm font-medium">
                                Selecione um barbeiro para visualizar os horários disponíveis.
                            </p>
                        </div>
                    ) : loading ? (
                        <div className="flex justify-center items-center h-40">
                            <svg
                                className="animate-spin h-12 w-12"
                                style={{ color: customization?.corSecundaria || "#0ea5e9" }}
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
                                        className="p-4 w-full rounded-xl text-white text-center shadow-md transition-all hover:scale-105"
                                        style={{
                                            backgroundColor: customization?.corPrimaria || "#0ea5e9",
                                        }}
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
            </main>

            <Footer />
        </div>
    );
};

export default Appointment;