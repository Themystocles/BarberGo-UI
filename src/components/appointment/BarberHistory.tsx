import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { IMyAppointments } from "../../interfaces/IMyAppointments";
import { IAppUser } from "../../interfaces/AppUser";
import Header from "../header/Header";

const BarberHistory = () => {
    const [appointments, setAppointments] = useState<IMyAppointments[]>([]);
    const [user, setUser] = useState<IAppUser | null>(null);
    const [date, setDate] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false); // estado para loading

    const fetchAppointments = useCallback(async (userId: number, selectedDate: string) => {
        setLoading(true); // começa a carregar
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: { Authorization: `Bearer ${token}` },
                ...(selectedDate && {
                    params: { date: new Date(selectedDate).toISOString() }
                })
            };

            const response = await axios.get(
                `https://barbergo-api.onrender.com/api/Appointment/BarberHistoryappointments/${userId}`,
                config
            );
            setAppointments(response.data);
        } catch (error) {
            console.error("Erro ao buscar histórico do barbeiro:", error);
            setAppointments([]); // limpa se erro
        } finally {
            setLoading(false); // terminou de carregar
        }
    }, []);

    const loadUserProfile = useCallback(async () => {
        setLoading(true); // começa a carregar
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://barbergo-api.onrender.com/api/AppUser/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const loggedUser = response.data;
            setUser(loggedUser);
            await fetchAppointments(loggedUser.id, date);
        } catch (error) {
            console.error("Erro ao carregar perfil do usuário:", error);
        } finally {
            setLoading(false); // terminou de carregar
        }
    }, [fetchAppointments, date]);

    useEffect(() => {
        loadUserProfile();
    }, [loadUserProfile]);

    useEffect(() => {
        if (user) {
            fetchAppointments(user.id, date);
        }
    }, [date, user, fetchAppointments]);

    return (
        <div
            className="min-h-screen bg-cover bg-center text-white flex flex-col"
            style={{
                backgroundImage:
                    "url('https://i.pinimg.com/originals/19/26/6e/19266e1b4e9597fc43dc5cb056d3100b.jpg')"
            }}
        >
            <Header />

            <main className="flex-1 px-4 py-10 bg-black bg-opacity-70 flex flex-col items-center">
                <h2 className="text-4xl font-bold mb-6 text-center">Histórico de Agendamentos</h2>

                <div className="mb-8 w-full max-w-md">
                    <label htmlFor="date" className="block text-lg mb-2 text-white">Filtrar por data:</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-2 rounded-md text-black bg-white"
                    />
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
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                            {appointments.map((a) => (
                                <div
                                    key={a.id}
                                    className="bg-gray-800 bg-opacity-80 p-6 rounded-xl shadow-lg border border-gray-700"
                                >
                                    <h3 className="text-xl font-semibold mb-2">Corte: {a.haircutName}</h3>
                                    <p className="text-gray-300"><strong>Barbeiro:</strong> {a.barberName}</p>
                                    <p className="text-gray-300"><strong>Cliente:</strong> {a.clientName}</p>
                                    <p className="text-gray-300"><strong>Data:</strong> {new Date(a.dateTime).toLocaleString("pt-BR")}</p>
                                </div>
                            ))}
                        </div>

                        {!appointments.length && (
                            <p className="text-gray-300 mt-10">Nenhum agendamento encontrado.</p>
                        )}
                    </>
                )}
            </main>

            <footer className="text-center p-4 text-sm text-gray-400 bg-gray-900 bg-opacity-90">
                © 2025 Barbearia Barba Negra. Todos os direitos reservados.
            </footer>
        </div>
    );
};

export default BarberHistory;
