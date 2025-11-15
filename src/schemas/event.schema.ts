import { ApiSlotListDataSchema } from "@/schemas/event-slot.schema";
import { z } from "zod";

/* List */
const ApiListDataSchema = z.object({
    id: z.uuid(),
    title: z.string(),
    type: z.string(),
    description: z.string().nullable(),
    registration_from: z.coerce.date(),
    registration_till: z.coerce.date(),
    created_at: z.coerce.date(),
});

export const EventListItemDataSchema = ApiListDataSchema.transform((apiData) => {
    return {
        id: apiData.id,
        title: apiData.title,
        type: apiData.type,
        description: apiData.description,
        registrationFrom: apiData.registration_from,
        registrationTill: apiData.registration_till,
        createdAt: apiData.created_at,
    };
})

export const EventListDataSchema = z.array(EventListItemDataSchema);

export type EventListData = z.infer<typeof EventListItemDataSchema>;

/* Details */
const ApiDetailDataSchema = z.object({
    id: z.uuid(),
    title: z.string(),
    type: z.string(),
    description: z.string().nullable(),
    registration_from: z.coerce.date(),
    registration_till: z.coerce.date(),
    created_at: z.coerce.date(),
    event_slot: z.array(ApiSlotListDataSchema),
});

export const EventDetailDataSchema = ApiDetailDataSchema.transform((apiData) => {
    return {
        id: apiData.id,
        title: apiData.title,
        type: apiData.type,
        description: apiData.description,
        registrationFrom: apiData.registration_from,
        registrationTill: apiData.registration_till,
        slots: apiData.event_slot,
        createdAt: apiData.created_at,
    };
})

export type EventDetailData = z.infer<typeof EventDetailDataSchema>;