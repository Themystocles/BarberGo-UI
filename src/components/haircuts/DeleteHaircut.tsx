import { useState } from "react"

import axios from "axios";

interface DeleteHaircutProps {
    haircutId: number;
    onDeleted: () => void;
    showbtnsave: () => void;
    showcancel: () => void;
}

const DeleteHaircut = ({ haircutId, onDeleted, showbtnsave, showcancel }: DeleteHaircutProps) => {
    const [showbutonDelete, setshowbutonDelete] = useState<boolean>(true);
    const [confirmdelete, setConfirmdelete] = useState<boolean>(false);

    const handleclick = async () => {

        try {
            var token = localStorage.getItem("token")
            await axios.delete(`https://barbergo-api.onrender.com/api/Haircuts/delete/${haircutId}`, {
                headers: { Authorization: `Bearer ${token}` }

            })
        } catch {
            console.error("Ocorreu um erro ao deletar o corte.");

        }




        setConfirmdelete(true)




        onDeleted();

    }
    const buttoncancelar = () => {

        onDeleted();
    }


    return <>
        {showbutonDelete &&
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                onClick={() => {
                    setConfirmdelete(true);
                    setshowbutonDelete(false);
                    showbtnsave();
                    showcancel();
                }}
            >
                Deletar Corte
            </button >
        }


        {
            confirmdelete && (

                <div className="mt-4 p-4 border rounded bg-white max-w-sm mx-auto text-center shadow-md">
                    <p className="mb-4 text-gray-700 text-base font-medium">
                        Tem certeza que deseja deletar o corte?
                    </p>
                    <div className="flex justify-center gap-3">
                        <button
                            className="w-28 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
                            onClick={handleclick}
                        >
                            Confirmar
                        </button>
                        <button
                            className="w-28 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition duration-200"
                            onClick={buttoncancelar}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>

            )
        }
    </>


};

export default DeleteHaircut;