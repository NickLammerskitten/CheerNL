import { ApiSlotCoachListDataSchema, EventSlotCoachListDataSchema } from "@/schemas/event-slot-coach.schema";
import {
    ApiSlotRegistrationListDataSchema,
    EventSlotRegistrationListDataSchema,
} from "@/schemas/event-slot-registration.schema";
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
    slot_end: z.coerce.date().nullable(),
    day_of_week: z.string().nullable(),
    start_time: z.string().nullable().transform((zeit) => {
        if (!zeit) {
            return null;
        }

        return zeit.split('+')[0]
    }),
    event_slot_coach: z.array(ApiSlotCoachListDataSchema).nullable(),
    created_at: z.coerce.date(),
});

export const EventSlotListItemDataSchema = ApiSlotListDataSchema.transform((apiData) => {
    return mapBaseSlotData(apiData);
})

export const EventSlotListDataSchema = z.array(EventSlotListItemDataSchema);

export type EventSlotListData = z.infer<typeof EventSlotListItemDataSchema>;

// --- DETAIL VIEW ---
export const ApiSlotDetailDataSchema = ApiSlotListDataSchema.extend({
    event_registration: z.array(ApiSlotRegistrationListDataSchema).nullable(),
});

export const EventSlotDetailDataSchema = ApiSlotDetailDataSchema.transform((apiData) => {
    const baseData = mapBaseSlotData(apiData);

    return {
        ...baseData,
        registrations: apiData.event_registration
            ? EventSlotRegistrationListDataSchema.parse(apiData.event_registration)
            : [],
    };
});

export const EventSlotDetailDataSchemaList = z.array(EventSlotDetailDataSchema);

export type EventSlotDetailData = z.infer<typeof EventSlotDetailDataSchema>;

const mapBaseSlotData = (apiData: z.infer<typeof ApiSlotListDataSchema>) => {
    return {
        id: apiData.id,
        eventId: apiData.event_id,
        title: apiData.title,
        location: apiData.location,
        durationMinutes: apiData.duration_minutes,
        recurrenceType: apiData.recurrence_type as RecurrenceType,
        slotStart: apiData.slot_start,
        slotEnd: apiData.slot_end,
        dayOfWeek: apiData.day_of_week as DayOfWeek,
        startTime: apiData.start_time,
        coaches: EventSlotCoachListDataSchema.parse(apiData.event_slot_coach ?? []),
        createdAt: apiData.created_at,
    };
};

/* Create */
export const EventSlotCreateSchema = z.object({
    event_id: z.string(),
    title: z.string().min(1, { message: "Der Titel darf nicht leer sein." }).nullable(),
    location: z.string().min(1, { message: "Der Ort darf nicht leer sein." }).nullable(),
    duration_minutes: z.int().min(1, { message: "Die Dauer muss größer als 0 sein" }),
    recurrence_type: z.string(),
    slot_start: z.string().nullable(),
    slot_end: z.string().nullable(),
    day_of_week: z.string().nullable(),
    start_time: z.string().nullable(),
    coach_ids: z.array(z.string()).nullable(),
})
    .refine((data) => {
        const recurrenceType = data.recurrence_type as RecurrenceType;

        if (recurrenceType === RecurrenceType.WEEKLY) {
            const hasRequiredFields =
                data.slot_start !== null &&
                data.slot_end !== null &&
                data.day_of_week !== null &&
                data.start_time !== null;

            if (!hasRequiredFields) {
                return false;
            }

            const start = new Date(data.slot_start!);
            const end = new Date(data.slot_end!);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return false;
            }

            return start < end;
        } else if (recurrenceType === RecurrenceType.ONCE) {
            data.slot_end = null;
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