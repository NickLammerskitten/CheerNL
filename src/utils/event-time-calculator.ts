import { addMinutes, format, parse } from "date-fns";

export function calculateEndTimeRecurrent(startTime: string | null, durationMinutes: number): string {
    if (!startTime) {
        return "00:00";
    }

    const cleanTime = startTime.slice(0, 5);

    const startDate = parse(cleanTime, 'HH:mm', new Date());

    const endDate = addMinutes(startDate, durationMinutes);

    return format(endDate, 'HH:mm');
}

export function calculateStartTimeOnce(slotStart: Date | null) {
    if (!slotStart) {
        return "00:00";
    }

    return format(slotStart, 'HH:mm');
}

export function calculateEndTimeOnce(slotStart: Date | null, durationMinutes: number): string {
    if (!slotStart) {
        return "00:00";
    }

    const cleanTime = slotStart.getHours() + ":" + slotStart.getMinutes();

    const startDate = parse(cleanTime, 'HH:mm', new Date());

    const endDate = addMinutes(startDate, durationMinutes);

    return format(endDate, 'HH:mm');
}