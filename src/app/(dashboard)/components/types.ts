export interface DashboardParticipant {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    note?: string | null;
}

export interface DashboardEventInstance {
    id: string;
    date: Date;
    startTime: string;
    durationMinutes: number;
    title: string;
    subTitle?: string;
    location: string;
    coaches: string[];
    participants: DashboardParticipant[];
}