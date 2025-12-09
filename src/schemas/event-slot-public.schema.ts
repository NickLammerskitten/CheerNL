import { DayOfWeek } from "@/types/day-of-week";
import { RecurrenceType } from "@/types/recurrence-type";
import { z } from "zod";

export const ApiSlotPublicListDataSchema = z.object({
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
});

export const EventSlotPublicListItemDataSchema = ApiSlotPublicListDataSchema.transform((apiData) => {
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
    };
})

export const EventSlotPublicListDataSchema = z.array(EventSlotPublicListItemDataSchema);

export type EventSlotPublicListData = z.infer<typeof EventSlotPublicListItemDataSchema>;
