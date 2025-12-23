import { EventSlotOccurrence } from "@/schemas/event-slot-occurence.schema";
import { EventSlotDetailData } from "@/schemas/event-slot.schema";
import { EventListData } from "@/schemas/event.schema";
import { DayMap, DayOfWeek } from "@/types/day-of-week";
import { RecurrenceType } from "@/types/recurrence-type";
import { calculateEndTime } from "@/utils/end-time-calculator";
import { addDays, getDay, isAfter, isBefore, isWithinInterval, startOfDay } from "date-fns";

export type SlotWithEvent = {
    slot: EventSlotDetailData;
    event: EventListData;
}

function isSameWeekDay(date: Date, dbDayString: DayOfWeek | null): boolean {
    if (!dbDayString) {
        return false;
    }
    const dateDayIndex = getDay(date);
    const requiredDayIndex = DayMap[dbDayString];
    return dateDayIndex === requiredDayIndex;
}

export function mapSlotsToOccurrences(
    joinedSlots: SlotWithEvent[],
    viewStart: Date,
    viewEnd: Date,
): EventSlotOccurrence[] {
    const occurrences: EventSlotOccurrence[] = [];

    for (const { slot, event } of joinedSlots) {

        if (slot.recurrenceType === RecurrenceType.ONCE && slot.slotStart) {
            if (isWithinInterval(slot.slotStart, { start: viewStart, end: viewEnd })) {
                occurrences.push(singleOccurrence(slot, event));
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
                    occurrences.push(multiOccurrence(slot, event, currentCursor));
                }

                currentCursor = addDays(currentCursor, 1);
            }
        }
    }

    return sortOccurrences(occurrences);
}

function singleOccurrence(slot: EventSlotDetailData, event: EventListData) {
    return {
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
    } as EventSlotOccurrence
}

function multiOccurrence(slot: EventSlotDetailData, event: EventListData, date: Date) {
    return {
        id: `${slot.id}-${date.toISOString()}`,
        slotId: slot.id,

        date: new Date(date),
        startTime: slot.startTime?.slice(0, 5) ?? "00:00",
        endTime: calculateEndTime(slot.startTime, slot.durationMinutes),

        title: slot.title ?? event.title,
        registrations: slot.registrations,
        coaches: slot.coaches,
        type: event.type,
        location: slot.location,
    } as EventSlotOccurrence
}

function sortOccurrences(occurrences: EventSlotOccurrence[]): EventSlotOccurrence[] {
    return occurrences.sort((a, b) => {
        const dateDiff = a.date.getTime() - b.date.getTime();

        if (dateDiff !== 0) {
            return dateDiff;
        }

        return a.startTime.localeCompare(b.startTime);
    });
}
