import { Haircut } from "./Haircut";

export interface UpdateHaircutModalProps {
    haircut: Haircut;
    onClose: () => void;
    onUpdated: () => void;
}