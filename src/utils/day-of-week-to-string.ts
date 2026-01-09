import {DayOfWeek, days} from "@/types/day-of-week";

export function dayOfWeekToString(day: DayOfWeek): string | undefined {
    return days.values().find((value) => value.enum === day)?.string;
}