import { useContext, useEffect, useState } from "react";
import { Haircut } from "../../interfaces/Haircut";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../header/Header";
import UpdateHaircutModal from "../haircuts/UpdateHairCutModal";
import useUser from "../../hooks/useUser";
import { CustomizationContext } from "../../context/CustomizationContext";

const HaircutsComponent = () => {
    const [haircuts, setHaircuts] = useState<Haircut[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedHaircut, setSelectedHaircut] = useState<Haircut | null>(null);
    const { userType } = useUser();
    const { customization } = useContext(CustomizationContext);

    useEffect(() => {
        const fetchHaircuts = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("https://barbergo-api.onrender.com/api/Haircuts", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setHaircuts(response.data);
            } catch {
                console.error("Não foi possível carregar os cortes disponíveis");
            }
        };

        fetchHaircuts();
    }, []);

    const openModal = (haircut: Haircut) => {
        setSelectedHaircut(haircut);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedHaircut(null);
        setShowModal(false);
    };

    return (
        <>
            <Header />
            <div className="min-h-screen text-white px-4 py-12 flex flex-col items-center" style={{ backgroundColor: customization.backgroundColor }}>
                <section className="max-w-4xl text-center mb-12 px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-wide">
                        Conheça a Barbearia Barba Negra
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        Aqui você encontra um ambiente acolhedor, profissionais experientes e os melhores cortes para realçar seu estilo.
                        Seja bem-vindo e descubra nossos serviços feitos especialmente para você.
                    </p>
                </section>

                <section className="w-full max-w-6xl">
                    <h2 className="text-3xl font-semibold mb-8 border-b-2 border-indigo-600 pb-3">
                        Nossos Cortes Disponíveis
                    </h2>

                    {userType === 1 && (
                        <div className="flex justify-end mb-6">
                            <Link
                                to="/NovoCorte"
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 transition rounded-lg shadow font-semibold"
                            >
                                Cadastrar Novo Corte
                            </Link>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {haircuts.map((h) => (
                            <div
                                key={h.id}
                                className="bg-gray-700 rounded-xl p-5 shadow-lg flex flex-col items-center text-center hover:scale-[1.03] transition-transform cursor-pointer"
                                onClick={() => userType === 1 && openModal(h)}
                                title={userType === 1 ? "Clique para editar" : undefined}
                            >
                                <div className="w-full h-48 rounded-lg overflow-hidden mb-4 bg-gray-600 flex items-center justify-center">
                                    <img
                                        src={h.imagePath}
                                        alt={h.name}
                                        className="max-h-full max-w-full object-contain"
                                        loading="lazy"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold">{h.name}</h3>
                                <p className="text-gray-300 mt-1">Duração: <span className="font-semibold">{h.duracao} min</span></p>
                                <p className="text-gray-300">Preço: <span className="font-semibold">R$ {h.preco.toFixed(2)}</span></p>
                                {userType === 1 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openModal(h);
                                        }}
                                        className="mt-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-semibold transition"
                                    >
                                        Editar
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {showModal && selectedHaircut && (
                    <UpdateHaircutModal
                        haircut={selectedHaircut}
                        onClose={closeModal}
                        onUpdated={() => {
                            setShowModal(false);
                            setSelectedHaircut(null);
                            axios.get("https://barbergo-api.onrender.com/api/Haircuts", {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                            }).then(res => setHaircuts(res.data));
                        }}
                    />
                )}
            </div>
            <footer className="fixed bottom-0 left-0 w-full text-center p-4 text-sm text-gray-400 bg-gray-900">
                © 2025 Barbearia Barba Negra. Todos os direitos reservados.
            </footer>
        </>

    );
};

export default HaircutsComponent;
