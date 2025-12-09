import { DayOfWeek } from "@/types/day-of-week";

export const days = [
    { enum: DayOfWeek.MONDAY, string: "Montags" },
    { enum: DayOfWeek.TUESDAY, string: "Dienstags" },
    { enum: DayOfWeek.WEDNESDAY, string: "Mittwochs" },
    { enum: DayOfWeek.THURSDAY, string: "Donnerstags" },
    { enum: DayOfWeek.FRIDAY, string: "Freitags" },
    { enum: DayOfWeek.SATURDAY, string: "Samstags" },
    { enum: DayOfWeek.SUNDAY, string: "Sonntags" },
];

export function dayOfWeekToString(day: DayOfWeek): string | undefined {
    return days.values().find((value) => value.enum === day)?.string;
}