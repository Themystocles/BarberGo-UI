import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { IFeedback } from "../../interfaces/IFeedback";

interface UpdateFeedbackProps {
    barberId: number;
    onClose: () => void;
    userFeedback: IFeedback | null;
}

const UpdateFeedback = ({ barberId: _, onClose, userFeedback }: UpdateFeedbackProps) => {
    const [comment, setComment] = useState(userFeedback?.comment ?? "");
    const [rating, setRating] = useState(userFeedback?.rating ?? 0);
    const [error, setError] = useState("");

    // Atualiza os estados se o userFeedback mudar
    useEffect(() => {
        if (userFeedback) {
            setComment(userFeedback.comment);
            setRating(userFeedback.rating);
        }
    }, [userFeedback]);

    const updateFeedback = async () => {
        if (!userFeedback) return;

        if (!comment.trim() || rating === 0) {
            setError("Por favor, digite um comentário e selecione uma nota.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `https://barbergo-api.onrender.com/api/Feedback/update-feedback/${userFeedback.id}`,
                {
                    id: userFeedback.id,
                    appUserName: userFeedback.appUserName,
                    barberName: userFeedback.barberName,
                    comment,
                    rating,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Feedback atualizado com sucesso!");
            onClose();
        } catch (err) {
            console.error("Erro ao atualizar feedback:", err);
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError<{ message: string }>;
                setError(
                    axiosError.response?.data?.message || "Erro ao atualizar feedback. Verifique sua conexão."
                );
            } else {
                setError("Erro inesperado. Tente novamente.");
            }

        }

    };
    const removeComent = () => {
        if (userFeedback) {
            try {
                const token = localStorage.getItem("token");
                axios.delete(
                    `https://barbergo-api.onrender.com/api/Feedback/delete/${userFeedback.id}`,

                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert("Feedback Deletado com sucesso!");

            } catch {
                alert("Erro ao excluir comentário");

            }

        }

    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md animate-fade-in">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Editar Feedback</h2>

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
                        onClick={removeComent}
                        className="px-4 py-2 bg-red-300 dark:bg-red-600 text-gray-900 dark:text-white rounded-md hover:bg-red-400 dark:hover:bg-red-500 transition"
                    >
                        Deletar Comentário
                    </button>
                    <button
                        onClick={updateFeedback}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
                    >
                        Atualizar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateFeedback;
