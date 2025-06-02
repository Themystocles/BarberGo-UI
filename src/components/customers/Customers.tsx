import { useEffect, useState } from "react";
import { ICustomers } from "../../interfaces/ICustomers";
import axios from "axios";
import Header from "../header/Header";
import { useNavigate } from "react-router-dom"; // 👈 importar hook

const Customers = () => {
    const [customers, setCustomers] = useState<ICustomers[]>([]);
    const [datenow, setDatenow] = useState<string>(new Date().toISOString().slice(0, 10));
    const navigate = useNavigate(); // 👈 hook de navegação

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDatenow(e.target.value);
    };

    const Listcustomers = async () => {
        const token = localStorage.getItem("token");
        const responseUser = await axios.get("https://barbergo-api.onrender.com/api/AppUser/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const user = responseUser.data.id;

        const response = await axios.get(`https://barbergo-api.onrender.com/api/MyCustomers/ClientesDoDia/${user}?date=${datenow}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(response.data);
    };

    useEffect(() => {
        Listcustomers();
    }, [datenow]);

    const formatTime = (dateTime: string) => {
        const time = new Date(dateTime);
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            <Header />

            <div className="bg-gray-800 min-h-screen py-10 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-semibold text-center mb-6 text-white">Clientes Agendados</h1>

                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <label htmlFor="date" className="block text-lg font-medium text-gray-200">Escolha a data</label>
                            <input
                                id="date"
                                type="date"
                                value={datenow}
                                onChange={handleDateChange}
                                className="mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white bg-gray-900"
                            />
                        </div>

                        {/* Botão para histórico */}
                        <button
                            onClick={() => navigate("/HistoricoClientes")}
                            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                        >
                            Ver Histórico
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {customers.map((c) => (
                            <div key={c.id} className="bg-gray-700 shadow-lg rounded-lg overflow-hidden">
                                <div className="p-4">
                                    <p className="text-gray-300">Nome: {c.clientName}</p>
                                    <p className="text-gray-300">Telefone: {c.clientPhone}</p>
                                    <p className="text-gray-300">Corte: {c.haircutName}</p>
                                    <p className="text-gray-300">Preço: R$ {c.haircutPreco}</p>
                                    <p className="text-gray-300">Horário: {formatTime(c.dateTime)}</p>
                                    <p className="text-gray-300">Status: <span className={`font-semibold ${c.status === 'Confirmado' ? 'text-green-400' : 'text-red-400'}`}>{c.status}</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Customers;
