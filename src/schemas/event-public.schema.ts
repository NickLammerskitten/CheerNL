import { ApiSlotPublicListDataSchema, EventSlotPublicListDataSchema } from "@/schemas/event-slot-public.schema";
import { EventType } from "@/types/event-type";
import { z } from "zod";

const ApiListDataSchema = z.object({
    id: z.uuid(),
    title: z.string(),
    type: z.string(),
    registration_from: z.coerce.date(),
    registration_till: z.coerce.date(),
});

export const EventPublicListItemDataSchema = ApiListDataSchema.transform((apiData) => {
    return {
        id: apiData.id,
        title: apiData.title,
        type: apiData.type,
        registrationFrom: apiData.registration_from,
        registrationTill: apiData.registration_till,
    };
})

export const EventPublicListDataSchema = z.array(EventPublicListItemDataSchema);

export type EventPublicListData = z.infer<typeof EventPublicListItemDataSchema>;

/* Details */
const ApiDetailDataSchema = z.object({
    id: z.uuid(),
    title: z.string(),
    type: z.string(),
    description: z.string().nullable(),
    registration_from: z.coerce.date(),
    registration_till: z.coerce.date(),
    created_at: z.coerce.date(),
    event_slot: z.array(ApiSlotPublicListDataSchema),
});

export const EventDetailPublicDataSchema = ApiDetailDataSchema.transform((apiData) => {
    return {
        id: apiData.id,
        title: apiData.title,
        type: apiData.type as EventType,
        description: apiData.description,
        registrationFrom: apiData.registration_from,
        registrationTill: apiData.registration_till,
        slots: EventSlotPublicListDataSchema.parse(apiData.event_slot),
        createdAt: apiData.created_at,
    };
})

export type EventPublicDetailData = z.infer<typeof EventDetailPublicDataSchema>;
