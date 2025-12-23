import { EventSlotPublicListData } from "@/schemas/event-slot-public.schema";
import { EventSlotDetailData } from "@/schemas/event-slot.schema";
import { RecurrenceType } from "@/types/recurrence-type";
import { addDays, addMinutes, format, getDay, parse } from "date-fns";

// Mapping für ICS (RRULE)
const IcsDayMap: Record<string, string> = {
    SUNDAY: "SU",
    MONDAY: "MO",
    TUESDAY: "TU",
    WEDNESDAY: "WE",
    THURSDAY: "TH",
    FRIDAY: "FR",
    SATURDAY: "SA",
};

// Mapping für Berechnungen (date-fns getDay: 0=So, 1=Mo, ...)
const JsDayMap: Record<string, number> = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
};

/**
 * Formatiert ein Date-Objekt in den ICS String: YYYYMMDDTHHmmss
 * Wir nutzen hier "Floating Time" (ohne Z am Ende), damit der Kalender des Users
 * die Zeit als lokale Zeit interpretiert (wichtig für Trainings vor Ort).
 */
const formatDateToICS = (date: Date) => format(date, "yyyyMMdd'T'HHmmss");

export function generateIcsData(slot: EventSlotDetailData | EventSlotPublicListData): string {
    if (!slot.slotStart || !slot.startTime) {
        throw new Error("Slot hat kein Startdatum oder keine Startzeit");
    }

    let effectiveStartDate = new Date(slot.slotStart);

    if (slot.recurrenceType === RecurrenceType.WEEKLY && slot.dayOfWeek) {
        const targetDayIndex = JsDayMap[slot.dayOfWeek];
        const currentDayIndex = getDay(effectiveStartDate);

        let daysToAdd = targetDayIndex - currentDayIndex;
        if (daysToAdd < 0) {
            daysToAdd += 7;
        }

        effectiveStartDate = addDays(effectiveStartDate, daysToAdd);
    }

    const cleanTime = slot.startTime.slice(0, 5);
    const parsedTime = parse(cleanTime, 'HH:mm', new Date());

    const startDateTime = new Date(effectiveStartDate);
    startDateTime.setHours(parsedTime.getHours(), parsedTime.getMinutes(), 0, 0);

    const endDateTime = addMinutes(startDateTime, slot.durationMinutes);

    const now = formatDateToICS(new Date());
    const dtStart = formatDateToICS(startDateTime);
    const dtEnd = formatDateToICS(endDateTime);
    const summary = slot.title;
    const location = slot.location ?? "";
    const description = `Trainer: ${(slot.coaches ?? []).map(c => c.coachName).join(", ")}`;
    const uid = `${slot.id}-${format(startDateTime, 'yyyyMMdd')}`;

    let icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Cheer App//DE",
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${now}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:${summary}`,
        `LOCATION:${location}`,
        `DESCRIPTION:${description}`,
    ];

    if (slot.recurrenceType === RecurrenceType.WEEKLY && slot.dayOfWeek) {
        const icsDay = IcsDayMap[slot.dayOfWeek];

        let rrule = `RRULE:FREQ=WEEKLY;BYDAY=${icsDay}`;

        if (slot.slotEnd) {
            const untilDate = new Date(slot.slotEnd);
            untilDate.setHours(23, 59, 59);
            rrule += `;UNTIL=${formatDateToICS(untilDate)}`;
        }

        icsContent.push(rrule);
    }

    icsContent.push("END:VEVENT");
    icsContent.push("END:VCALENDAR");

    return icsContent.join("\r\n");
}