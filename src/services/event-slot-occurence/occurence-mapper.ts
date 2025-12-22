import { EventSlotOccurrence } from "@/schemas/event-slot-occurence.schema";
import { EventSlotDetailData } from "@/schemas/event-slot.schema";
import { EventListData } from "@/schemas/event.schema";
import { DayOfWeek } from "@/types/day-of-week";
import { RecurrenceType } from "@/types/recurrence-type";
import { addDays, addMinutes, format, getDay, isAfter, isBefore, isWithinInterval, parse, startOfDay } from "date-fns";

// Mapping: DB String -> JS Date.getDay() Index
const DayMap: Record<DayOfWeek, number> = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
};

function isSameWeekDay(date: Date, dbDayString: DayOfWeek | null): boolean {
    if (!dbDayString) {
        return false;
    }
    const dateDayIndex = getDay(date);
    const requiredDayIndex = DayMap[dbDayString];
    return dateDayIndex === requiredDayIndex;
}

export function mapSlotsToOccurrences(
    events: EventListData[],
    slots: EventSlotDetailData[],
    viewStart: Date,
    viewEnd: Date,
): EventSlotOccurrence[] {

    const joinedSlots = slots.map((slot) => {
        const parentEvent = events.find((e) => e.id === slot.eventId);
        return parentEvent ? { slot, event: parentEvent } : null;
    }).filter((item): item is { slot: EventSlotDetailData; event: EventListData } => item !== null);

    const occurrences: EventSlotOccurrence[] = [];

    for (const { slot, event } of joinedSlots) {

        if (slot.recurrenceType === RecurrenceType.ONCE && slot.slotStart) {
            if (isWithinInterval(slot.slotStart, { start: viewStart, end: viewEnd })) {
                occurrences.push({
                    id: slot.id,
                    slotId: slot.id,
                    date: slot.slotStart,
                    startTime: slot.startTime?.slice(0, 5) ?? "00:00",
                    endTime: calculateEndTime(slot.startTime, slot.durationMinutes),
                    title: slot.title ?? event.title,
                    registrations: slot.registrations,
                    coaches: slot.coaches,
                    type: event.type,
                    location: slot.location,
                } as EventSlotOccurrence);
            }
        } else if (slot.recurrenceType === RecurrenceType.WEEKLY && slot.slotStart) {

            let currentCursor = isBefore(viewStart, slot.slotStart)
                ? startOfDay(slot.slotStart)
                : startOfDay(viewStart);

            const loopEnd = startOfDay(viewEnd);

            while (currentCursor <= loopEnd) {

                if (slot.slotEnd && isAfter(currentCursor, slot.slotEnd)) {
                    break;
                }

                if (isSameWeekDay(currentCursor, slot.dayOfWeek)) {

                    occurrences.push({
                        id: `${slot.id}-${currentCursor.toISOString()}`,
                        slotId: slot.id,

                        date: new Date(currentCursor),
                        startTime: slot.startTime?.slice(0, 5) ?? "00:00",
                        endTime: calculateEndTime(slot.startTime, slot.durationMinutes),

                        title: slot.title ?? event.title,
                        registrations: slot.registrations,
                        coaches: slot.coaches,
                        type: event.type,
                        location: slot.location,
                    } as EventSlotOccurrence);
                }

                currentCursor = addDays(currentCursor, 1);
            }
        }
    }

    return occurrences.sort((a, b) => a.date.getTime() - b.date.getTime());
}

function calculateEndTime(startTime: string | null, durationMinutes: number): string {
    if (!startTime) {
        return "00:00";
    }

    const cleanTime = startTime.slice(0, 5);

    const startDate = parse(cleanTime, 'HH:mm', new Date());

    const endDate = addMinutes(startDate, durationMinutes);

    return format(endDate, 'HH:mm');
}