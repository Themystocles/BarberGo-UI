import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { IAppUser } from "../../interfaces/AppUser";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { CustomizationContext } from "../../context/CustomizationContext";
import { IFeedback } from "../../interfaces/IFeedback";
import CreateFeedback from "./CreateFeedback"; // Modal

const Barbers = () => {
    const [barbersList, setBarbersList] = useState<IAppUser[]>([]);
    const [commentsByBarber, setCommentsByBarber] = useState<{ [barberId: number]: IFeedback[] }>({});
    const [visibleComments, setVisibleComments] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBarberId, setSelectedBarberId] = useState<number | null>(null);

    const { customization } = useContext(CustomizationContext);

    useEffect(() => {
        const fetchBarbers = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    "https://barbergo-api.onrender.com/api/WeeklySchedule/barbers",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
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
                const response = await axios.get(
                    `https://barbergo-api.onrender.com/api/Feedback/get/${barberId}`
                );
                setCommentsByBarber(prev => ({ ...prev, [barberId]: response.data }));
            } catch (error) {
                console.error(`Erro ao buscar comentários do barbeiro ${barberId}:`, error);
            }
        }

        setVisibleComments(barberId);
    };

    const handleComment = (barberId: number) => {
        setSelectedBarberId(barberId);
        setIsModalOpen(true);
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

                                    <div className="flex gap-2 mt-2">
                                        <button
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition duration-200"
                                            // Exemplo: abrir agendamento (mantive como antes)
                                            onClick={() => console.log("Agendar:", barber.id)}
                                        >
                                            Agendar
                                        </button>

                                        <button
                                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-xl transition duration-200"
                                            onClick={() => handleComment(barber.id)}
                                        >
                                            Comentar
                                        </button>
                                    </div>

                                    <div className="w-full mt-4 text-left">
                                        <span
                                            onClick={() => handleToggleComments(barber.id)}
                                            className="text-xs text-gray-400 hover:text-indigo-400 cursor-pointer select-none"
                                        >
                                            {visibleComments === barber.id
                                                ? "Ocultar comentários"
                                                : `Ver comentários (${feedbacks.length})`}
                                        </span>

                                        {visibleComments === barber.id && (
                                            <div className="mt-2 max-h-48 overflow-y-auto space-y-3 text-sm bg-gray-900 p-4 rounded-xl scrollbar-hide">
                                                {feedbacks.length === 0 ? (
                                                    <p className="text-gray-400 italic text-center">Sem comentários.</p>
                                                ) : (
                                                    feedbacks.map((feedback) => (
                                                        <div
                                                            key={feedback.id}
                                                            className="bg-gray-800 p-3 rounded-lg shadow-inner hover:bg-gray-700 transition duration-200"
                                                        >
                                                            <p className="text-indigo-300 font-semibold">{feedback.appUserName}</p>
                                                            <p className="text-gray-300 mt-1">{feedback.comment}</p>
                                                            <div className="mt-1 flex items-center gap-1">
                                                                <span className="text-yellow-400 font-bold">{'★'.repeat(feedback.rating)}</span>
                                                                <span className="text-gray-400 text-xs">({feedback.rating}/5)</span>
                                                            </div>
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

            {/* Modal de Feedback */}
            {isModalOpen && selectedBarberId !== null && (
                <CreateFeedback
                    barberId={selectedBarberId}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
};

export default Barbers;
