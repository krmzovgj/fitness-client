export enum UserRole {
    TRAINER = 'TRAINER',
    CLIENT = 'CLIENT',
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    age: number;
    height: number;
    weight: number;
    gender: string;
    role: UserRole;
}
