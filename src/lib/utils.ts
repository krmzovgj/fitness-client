import { Day, type Exercise } from "@/model/exercise";
import { Type } from "@/model/meal";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const dayOrder: Day[] = [
    Day.MONDAY,
    Day.TUESDAY,
    Day.WEDNESDAY,
    Day.THURSDAY,
    Day.FRIDAY,
    Day.SATURDAY,
    Day.SUNDAY,
];

export const sortExercisesByDay = (exercises: Exercise[]): Exercise[] => {
    return [...exercises].sort(
        (a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
    );
};

export const dayColors: { day: Day; color: string }[] = [
    { day: Day.MONDAY, color: "#FF8C00" }, // orange
    { day: Day.TUESDAY, color: "#FF6B6B" }, // red
    { day: Day.WEDNESDAY, color: "#66A786" }, // green
    { day: Day.THURSDAY, color: "#4D96FF" }, // blue
    { day: Day.FRIDAY, color: "#9B5DE5" }, // purple
    { day: Day.SATURDAY, color: "#FF63C3" }, // purple
    { day: Day.SUNDAY, color: "#292929" }, // purple
];

export const mealTypes: { type: Type; color: string }[] = [
    { type: Type.BREKFAST, color: "#FF8C00" }, // orange
    { type: Type.LUNCH, color: "#FF6B6B" }, // red
    { type: Type.DINNER, color: "#66A786" }, // green
    { type: Type.SNACK, color: "#FF63C3" }, // purple
];
