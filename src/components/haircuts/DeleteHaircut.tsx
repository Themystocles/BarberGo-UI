import { use, useState } from "react"
import { Haircut } from "../../interfaces/Haircut";

interface DeleteHaircutProps {
    haircutId: number;
    onDeleted: () => void;
}

const DeleteHaircut = ({ haircutId, onDeleted }: DeleteHaircutProps) => {
    const [showbutonDelete, setshowbutonDelete] = useState<boolean>(true);

    const [confirmdelete, setConfirmdelete] = useState<boolean>(false);

    const handleclick = () => {
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