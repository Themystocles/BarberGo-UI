import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { IAppUser } from "../../interfaces/AppUser";
import Header from "../header/Header";
import { useNavigate } from "react-router-dom";
import { CustomizationContext } from "../../context/CustomizationContext";
import Footer from "../footer/Footer";
import { IFeedback } from "../../interfaces/IFeedback";

const Barbers = () => {
    const [barbersList, setBarbersList] = useState<IAppUser[]>([]);
    const [commentsByBarber, setCommentsByBarber] = useState<{ [barberId: number]: IFeedback[] }>({});
    const [visibleComments, setVisibleComments] = useState<number | null>(null);
    const { customization } = useContext(CustomizationContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBarbers = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("https://barbergo-api.onrender.com/api/WeeklySchedule/barbers", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBarbersList(response.data);
            } catch (error) {
                console.error("Erro ao buscar barbeiros:", error);
            }
        };

        fetchBarbers();
    }, []);

    const handleToggleComments = async (barberId: number) => {
        if (visibleComments === barberId) {
            setVisibleComments(null);
            return;
        }

        if (!commentsByBarber[barberId]) {
            try {
                const response = await axios.get(`https://localhost:7032/api/Feedback/get/${barberId}`);
                setCommentsByBarber(prev => ({
                    ...prev,
                    [barberId]: response.data
                }));
            } catch (error) {
                console.error(`Erro ao buscar comentários do barbeiro ${barberId}:`, error);
            }
        }

        setVisibleComments(barberId);
    };

    return (
        <>
            <Header />
            <div
                className="min-h-screen text-white py-10 px-4"
                style={{ backgroundColor: customization.backgroundColor }}
            >
                <h2 className="text-3xl font-bold text-center mb-8">Nossos Barbeiros</h2>

                {barbersList.length === 0 ? (
                    <p className="text-center text-gray-400">Nenhum barbeiro encontrado.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {barbersList.map((barber) => {
                            const hasPhoto = barber.profilePictureUrl && barber.profilePictureUrl.trim() !== "";
                            const feedbacks = commentsByBarber[barber.id] || [];

                            return (
                                <div
                                    key={barber.id}
                                    className="bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:bg-gray-700 transition duration-300"
                                >
                                    {hasPhoto ? (
                                        <img
                                            src={barber.profilePictureUrl}
                                            alt={barber.name}
                                            className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-indigo-600"
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
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition duration-200 mt-2"
                                        onClick={() => navigate("/agendamentos", { state: { barberId: barber.id } })}
                                    >
                                        Agendar
                                    </button>

                                    {/* Comentários no final do card */}
                                    <div className="w-full mt-4 text-left">
                                        <span
                                            onClick={() => handleToggleComments(barber.id)}
                                            className="text-xs text-gray-400 hover:text-indigo-400 cursor-pointer select-none"
                                        >
                                            {visibleComments === barber.id
                                                ? "Ocultar comentários"
                                                : "Ver comentários"}
                                        </span>

                                        {visibleComments === barber.id && (
                                            <div className="mt-2 max-h-40 overflow-y-auto space-y-2 text-sm bg-gray-900 p-3 rounded-xl">
                                                {feedbacks.length === 0 ? (
                                                    <p className="text-gray-500 italic">Sem comentários.</p>
                                                ) : (
                                                    feedbacks.map((feedback) => (
                                                        <div key={feedback.id} className="border-b border-gray-700 pb-2">
                                                            <p className="text-indigo-300 font-semibold">
                                                                {feedback.appUserName}
                                                            </p>
                                                            <p className="text-gray-300">{feedback.comment}</p>
                                                            <p className="text-yellow-400 text-xs">
                                                                Nota: {feedback.rating}/5
                                                            </p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Barbers;
