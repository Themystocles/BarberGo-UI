export interface IFeedbackCreate {
    appUserId: number;
    barberId: number;
    rating: number;
    comment: string;
}
export interface IFeedbackUpdate {
    id: number;
    appUserId: number;
    barberId: number;
    rating: number;
    comment: string;
    onClose: () => void;
}