import type { Day } from "./day";

export interface Diet {
    id: string;
    name: string;
    day: Day;
    _count: any;
    clientId: number;
    updatedAt: string;
}
