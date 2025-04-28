import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { Haircut } from "../../interfaces/Haircut";

const ScheduleConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const receivedDateTime = location.state?.dateTime ?? "";
    const receivedBarber = location.state?.barberId ?? "";
    const receivedIdUser = location.state?.userId ?? "";
    const receivedBarberName = location.state?.barbername ?? "";

    const [Haircut, setHaircut] = useState<Haircut[]>([]);
    const [Haircutid, setHaircutid] = useState<number | undefined>(undefined);

    const [form, setForm] = useState({
        clientId: receivedIdUser,
        haircutId: Haircutid,
        barberId: receivedBarber,
        dateTime: receivedDateTime,
        status: "Confirmado",
    });

    const Haircuts = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://localhost:7032/api/Haircuts", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setHaircut(response.data);
        } catch (error) {
            console.error("Erro ao pegar os cortes:", error);
            alert("Erro ao Carregar os cortes.");
        }
    };

    // Atualiza o estado do form sempre que o haircutId for alterado
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedHaircutId = Number(e.target.value);
        setHaircutid(selectedHaircutId);
        setForm((prevForm) => ({
            ...prevForm,
            haircutId: selectedHaircutId, // Atualiza o haircutId no form
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log(form); // Verifique se o haircutId está correto no form

        try {
            const token = localStorage.getItem("token");
            await axios.post("https://localhost:7032/api/Appointment/create", form, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Agendamento confirmado com sucesso!");
            navigate("/"); // Volta para home ou agenda
        } catch (error) {
            console.error("Erro ao agendar:", error);
            alert("Erro ao confirmar agendamento.");
        }
    };

    useEffect(() => {
        Haircuts();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center px-4 py-10">
                <div className="w-full max-w-xl bg-gray-800 p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center">Confirmar Agendamento</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Campo 1: Corte */}
                        <div>
                            <h3 className="text-lg font-semibold">Corte</h3>
                            <select
                                value={Haircutid}
                                onChange={handleSelectChange}
                                required
                                className="bg-gray-700 text-white text-sm px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            >
                                <option value="">Selecione um corte</option>
                                {Haircut.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Campo 2: Nome do Barbeiro */}
                        <div>
                            <h3 className="text-lg font-semibold">Nome do Barbeiro</h3>
                            <input
                                type="text"
                                name="barberName"
                                placeholder="Nome do Barbeiro"
                                value={receivedBarberName}
                                onChange={handleChange}
                                className="bg-gray-700 p-2 rounded border border-gray-600 text-white"
                                required
                                readOnly
                            />
                        </div>

                        {/* Campo 3: Data e Hora */}
                        <div>
                            <h3 className="text-lg font-semibold">Data e Hora</h3>
                            <input
                                type="datetime-local"
                                name="dateTime"
                                value={form.dateTime}
                                onChange={handleChange}
                                className="bg-gray-700 p-2 rounded border border-gray-600 text-white"
                                required
                                readOnly
                            />
                        </div>

                        {/* Status (sempre "Confirmado") */}
                        <div>
                            <h3 className="text-lg font-semibold">Status</h3>
                            <p className="bg-gray-700 p-2 rounded border border-gray-600 text-white text-center">
                                Confirmado
                            </p>
                        </div>

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
