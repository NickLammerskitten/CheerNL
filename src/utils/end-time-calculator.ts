import { addMinutes, format, parse } from "date-fns";

export function calculateEndTime(startTime: string | null, durationMinutes: number): string {
    if (!startTime) {
        return "00:00";
    }

    const cleanTime = startTime.slice(0, 5);

    const startDate = parse(cleanTime, 'HH:mm', new Date());

    const endDate = addMinutes(startDate, durationMinutes);

    return format(endDate, 'HH:mm');
}