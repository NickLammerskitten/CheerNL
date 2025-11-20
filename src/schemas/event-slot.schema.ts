import { z } from "zod";

export const ApiSlotListDataSchema = z.object({
    id: z.uuid(),
    event_id: z.uuid(),
    title: z.string(),
    location: z.string().nullable(),
    duration_minutes: z.int(),
    recurrence_type: z.string(),
    slot_start: z.coerce.date().nullable(),
    day_of_week: z.int().nullable(),
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
        dayOfWeek: apiData.day_of_week,
        startTime: apiData.start_time,
        createdAt: apiData.created_at,
    };
})

export const EventSlotListDataSchema = z.array(EventSlotListItemDataSchema);

export type EventSlotListData = z.infer<typeof EventSlotListItemDataSchema>;

export enum RecurrenceType {
    ONCE = 'ONCE',
    WEEKLY = 'WEEKLY'
}
