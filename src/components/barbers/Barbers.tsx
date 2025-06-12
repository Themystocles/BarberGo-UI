import axios from "axios";
import { useEffect, useState } from "react";
import { IAppUser } from "../../interfaces/AppUser";
import Header from "../header/Header";
import { useNavigate } from "react-router-dom";

const Barbers = () => {
    const [barbersList, setBarbersList] = useState<IAppUser[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBarbers = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("https://barbergo-api.onrender.com/api/WeeklySchedule/barbers", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Dados recebidos:", response.data);

                setBarbersList(response.data);
            } catch (error) {
                console.error("Erro ao buscar barbeiros:", error);
            }
        };

        fetchBarbers();
    }, []);

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white py-10 px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Nossos Barbeiros</h2>

                {barbersList.length === 0 ? (
                    <p className="text-center text-gray-400">Nenhum barbeiro encontrado.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {barbersList.map((barber) => {
                            const hasPhoto = barber.profilePictureUrl && barber.profilePictureUrl.trim() !== "";
                            console.log("Foto do barbeiro:", barber.name, barber.profilePictureUrl);

                            return (
                                <div
                                    key={barber.id}
                                    className="bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:bg-gray-700 transition duration-300"
                                >
                                    {hasPhoto ? (
                                        <img
                                            src={barber.profilePictureUrl}
                                            alt={barber.name}
                                            className="w-24 h-24 max-w-full max-h-full rounded-full object-cover mb-4 border-4 border-indigo-600"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-gray-700 mb-4 flex items-center justify-center text-gray-400 border-4 border-indigo-600">
                                            Sem foto
                                        </div>
                                    )}
                                    <h3 className="text-xl font-semibold">{barber.name}</h3>
                                    <p className="text-sm text-gray-400 mt-1">{barber.email}</p>
                                    <p className="text-sm text-gray-400 mb-4">{barber.phone}</p>

                                    <button
                                        className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition duration-200"
                                        onClick={() =>
                                            navigate("/agendamentos", { state: { barberId: barber.id } })
                                        }
                                    >
                                        Cortar com {barber.name}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

export default Barbers;
