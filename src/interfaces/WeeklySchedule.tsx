import { User } from "./User";

export interface WeeklySchedule {

    id: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    intervalMinutes: number;
    barberId?: number;
    barber?: User;

};