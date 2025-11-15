import { z } from "zod";

export const ApiSlotListDataSchema = z.object({
    id: z.uuid(),
    event_id: z.uuid(),
    title: z.string(),
    location: z.string(),
    duration_minutes: z.int(),
    recurrence_type: z.string(),
    slot_start: z.coerce.date(),
    day_of_week: z.int(),
    start_time: z.iso.time(),
    created_at: z.coerce.date()
});

export const EventSlotListItemDataSchema = ApiSlotListDataSchema.transform((apiData) => {
    return {
        id: apiData.id,
        eventId: apiData.event_id,
        title: apiData.title,
        location: apiData.location,
        durationMinutes: apiData.duration_minutes,
        recurrenceType: apiData.recurrence_type,
        slotStart: apiData.slot_start,
        dayOfWeek: apiData.day_of_week,
        startTime: apiData.start_time,
        createdAt: apiData.created_at
    };
})

export const EventSlotListDataSchema = z.array(EventSlotListItemDataSchema);

export type EventSlotListData = z.infer<typeof EventSlotListItemDataSchema>;
