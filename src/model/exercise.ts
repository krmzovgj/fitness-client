export enum Day {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}

export interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: number;
    day: Day;
    workoutId: string;
    createdAt: string; 
    updatedAt: string; 
}
