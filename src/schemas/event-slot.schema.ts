import { DayOfWeek } from "@/types/day-of-week";
import { RecurrenceType } from "@/types/recurrence-type";
import { z } from "zod";

export const ApiSlotListDataSchema = z.object({
    id: z.uuid(),
    event_id: z.uuid(),
    title: z.string().nullable(),
    location: z.string().nullable(),
    duration_minutes: z.int(),
    recurrence_type: z.string(),
    slot_start: z.coerce.date().nullable(),
    day_of_week: z.string().nullable(),
    start_time: z.string().nullable().transform((zeit) => {
        if (!zeit) {
            return null;
        }

        return zeit.split('+')[0]
    }),
    created_at: z.coerce.date(),
});

export const EventSlotListItemDataSchema = ApiSlotListDataSchema.transform((apiData) => {
    return {
        id: apiData.id,
        eventId: apiData.event_id,
        title: apiData.title,
        location: apiData.location,
        durationMinutes: apiData.duration_minutes,
        recurrenceType: apiData.recurrence_type as RecurrenceType,
        slotStart: apiData.slot_start,
        dayOfWeek: apiData.day_of_week as DayOfWeek,
        startTime: apiData.start_time,
        createdAt: apiData.created_at,
    };
})

export const EventSlotListDataSchema = z.array(EventSlotListItemDataSchema);

export type EventSlotListData = z.infer<typeof EventSlotListItemDataSchema>;

/* Create */
export const EventSlotCreateSchema = z.object({
    event_id: z.string(),
    title: z.string().min(1, { message: "Der Titel darf nicht leer sein." }).nullable(),
    location: z.string().min(1, { message: "Der Ort darf nicht leer sein." }).nullable(),
    duration_minutes: z.int().min(1, { message: "Die Dauer muss größer als 0 sein" }),
    recurrence_type: z.string(),
    slot_start: z.string().nullable(),
    day_of_week: z.string().nullable(),
    start_time: z.string().nullable(),
})
    .refine((data) => {
        const recurrenceType = data.recurrence_type as RecurrenceType;

        if (recurrenceType === RecurrenceType.WEEKLY) {
            data.slot_start = null;

            const dayOfWeekValid = data.day_of_week !== null
            const startTimeValid = data.start_time !== null
            return dayOfWeekValid && startTimeValid
        } else if (recurrenceType === RecurrenceType.ONCE) {
            data.day_of_week = null;
            data.start_time = null;

            return data.slot_start !== null
        }

        return false
    }, {
        message: "Die Zeitinformationen sind fehlerhaft. Prüfe diese auf Fehler.",
        path: ["recurrence_type"],
    })

export type EventSlotCreateData = z.infer<typeof EventSlotCreateSchema>;