import {
    ApiSlotCoachPublicListDataSchema,
    EventSlotCoachPublicListDataSchema,
} from "@/schemas/event-slot-coach-public.schema";
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
    event_slot_coach: z.array(ApiSlotCoachPublicListDataSchema).nullable(),
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
        coaches: EventSlotCoachPublicListDataSchema.parse(apiData.event_slot_coach),
    };
})

export const EventSlotPublicListDataSchema = z.array(EventSlotPublicListItemDataSchema);

export type EventSlotPublicListData = z.infer<typeof EventSlotPublicListItemDataSchema>;
