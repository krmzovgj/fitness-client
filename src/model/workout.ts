import type { Day } from "./day";

export interface Workout {
    id: string;
    name: string;
    day: Day;
    note?: string;
    _count: any;
    restDay: boolean;
    clientId: number;
    updatedAt: string;
}
