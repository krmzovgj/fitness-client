import type { Day } from "./exercise";

export enum Type {
    BREKFAST = 'BREKFAST',
    LUNCH = 'LUNCH',
    DINNER = 'DINNER',
    SNACK = 'SNACK'
}

export interface Meal {
    id: string;
    name: string;
    desctription: string;
    cal?: number;
    protein?: number;
    day: Day;
    type: Type,
    createdAt: string;
    updatedAt: string;
}
