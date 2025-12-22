import { z } from "zod";

export const ApiSlotRegistrationListDataSchema = z.object({
    id: z.uuid(),
    event_id: z.uuid(),
    event_slot_id: z.uuid(),
    team_id: z.uuid(),
    team: z.object({
        name: z.string(),
    }).nullable(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    phone: z.string(),
    note: z.string().nullable(),
});

export const EventSlotRegistrationListItemDataSchema = ApiSlotRegistrationListDataSchema.transform((apiData) => {
    return {
        id: apiData.id,
        eventId: apiData.event_id,
        eventSlotId: apiData.event_slot_id,
        teamId: apiData.team_id,
        teamName: apiData.team?.name,
        firstName: apiData.first_name,
        lastName: apiData.last_name,
        email: apiData.email,
        phone: apiData.phone,
        note: apiData.note,
    }
})

export const EventSlotRegistrationListDataSchema = z.array(EventSlotRegistrationListItemDataSchema);

export type EventRegistrationData = z.infer<typeof EventSlotRegistrationListItemDataSchema>;
