import { useEffect, useState } from "react";
import { Haircut } from "../../interfaces/Haircut";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../header/Header";

const HaircutsComponent = () => {
    const [haircuts, setHaircuts] = useState<Haircut[]>([]);

    useEffect(() => {
        const fetchHaircuts = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("https://localhost:7032/api/Haircuts", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setHaircuts(response.data);
            } catch {
                console.error("Não foi possível pegar os cortes disponíveis");
            }
        };

        fetchHaircuts();
    }, []);

    return (
        <> <Header />
            <div className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white flex flex-col items-center py-10 px-4">

                <h2 className="text-3xl font-bold mb-6">Cortes Disponíveis</h2>

                <Link
                    to="/cadastrar-corte"
                    className="mb-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 transition rounded-xl shadow-md font-semibold"
                >
                    Cadastrar Novo Corte
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                    {haircuts.map((h) => (
                        <div
                            key={h.id}
                            className="bg-gray-700 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center"
                        >
                            <div className="w-full h-48 bg-gray-600 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                                <img
                                    src={h.imagePath}
                                    alt={h.name}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                            <h3 className="text-xl font-semibold">{h.name}</h3>
                            <p className="text-gray-300 mt-2">Duração: {h.duracao} min</p>
                            <p className="text-gray-300">Preço: R$ {h.preco.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default HaircutsComponent;
