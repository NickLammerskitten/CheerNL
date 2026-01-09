export enum DayOfWeek {
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY'
}

// Mapping: DB String -> JS Date.getDay() Index
export const DayMap: Record<DayOfWeek, number> = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
};

// Mapping für ICS (RRULE)
export const IcsDayMap: Record<DayOfWeek, string> = {
    SUNDAY: "SU",
    MONDAY: "MO",
    TUESDAY: "TU",
    WEDNESDAY: "WE",
    THURSDAY: "TH",
    FRIDAY: "FR",
    SATURDAY: "SA",
};

// Mapping für Frontend-Anzeige
export const days = [
    { enum: DayOfWeek.MONDAY, string: "Montags" },
    { enum: DayOfWeek.TUESDAY, string: "Dienstags" },
    { enum: DayOfWeek.WEDNESDAY, string: "Mittwochs" },
    { enum: DayOfWeek.THURSDAY, string: "Donnerstags" },
    { enum: DayOfWeek.FRIDAY, string: "Freitags" },
    { enum: DayOfWeek.SATURDAY, string: "Samstags" },
    { enum: DayOfWeek.SUNDAY, string: "Sonntags" },
];