import { useEffect, useState } from "react";
import { IFeedback } from "../../interfaces/IFeedback";
import axios, { AxiosError } from "axios";

interface CreateFeedbackProps {
    barberId: number;
    onClose: () => void;
}

const CreateFeedback = ({ barberId, onClose }: CreateFeedbackProps) => {
    const [user, setUser] = useState<number>();
    const [comment, setComment] = useState<string>("");
    const [rating, setRating] = useState<number>(0);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const userLogged = async () => {
            try {
                const token = localStorage.getItem("token");
                const responseUser = await axios.get(
                    "https://barbergo-api.onrender.com/api/AppUser/profile",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setUser(responseUser.data.id);
            } catch (err) {
                console.error("Erro ao buscar usuário:", err);
                setError("Não foi possível carregar o usuário. Tente novamente.");
            }
        };
        userLogged();
    }, []);

    const createFeedback = async () => {
        if (!user) return;

        if (!comment.trim() || rating === 0) {
            setError("Por favor, digite um comentário e selecione uma nota.");
            return;
        }

        const newFeedback: IFeedback = {
            appUserId: user,
            barberId,
            comment,
            rating,
        };

        try {
            await axios.post(
                "https://barbergo-api.onrender.com/api/Feedback/create-feedback",
                newFeedback
            );
            alert("Feedback enviado com sucesso!");
            onClose();
        } catch (err) {
            console.error("Erro ao enviar feedback:", err);

            // Captura a mensagem de erro detalhada do backend
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError<{ message: string }>;
                if (axiosError.response && axiosError.response.data) {
                    setError(axiosError.response.data.message || "Erro ao enviar feedback.");
                } else {
                    setError("Erro ao enviar feedback. Verifique sua conexão.");
                }
            } else {
                setError("Erro inesperado. Tente novamente.");
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md animate-fade-in">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Avaliar Barbeiro
                </h2>

                <textarea
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-md mb-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Digite seu comentário"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                />

                <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            onClick={() => setRating(star)}
                            className={`cursor-pointer text-4xl ${star <= rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-500"}`}
                        >
                            ★
                        </span>
                    ))}
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={createFeedback}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateFeedback;
