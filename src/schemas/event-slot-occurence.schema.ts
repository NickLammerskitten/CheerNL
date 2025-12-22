import { EventSlotCoachListDataSchema } from "@/schemas/event-slot-coach.schema";
import { EventSlotRegistrationListDataSchema } from "@/schemas/event-slot-registration.schema";
import { EventType } from "@/types/event-type";
import { z } from "zod";

export const EventSlotOccurrenceSchema = z.object({
    id: z.string(),

    slotId: z.uuid(),

    date: z.date(),
    startTime: z.string(),
    endTime: z.string(),

    title: z.string(),
    location: z.string().nullable(),

    registrations: EventSlotRegistrationListDataSchema,

    coaches: EventSlotCoachListDataSchema,

    type: z.enum(Object.values(EventType)),
});

export type EventSlotOccurrence = z.infer<typeof EventSlotOccurrenceSchema>;