import { z } from "zod";

export const ApiSlotCoachListDataSchema = z.object({
    id: z.uuid(),
    slot_id: z.uuid(),
    coach_id: z.uuid(),
    coach: z.object({
        name: z.string(),
    }).nullable(),
})

export const EventSlotCoachListItemDataSchema = ApiSlotCoachListDataSchema.transform((apiData) => {
    return {
        id: apiData.id,
        slotId: apiData.slot_id,
        coachId: apiData.coach_id,
        coachName: apiData.coach?.name,
    }
})

export const EventSlotCoachListDataSchema = z.array(EventSlotCoachListItemDataSchema);


export const EventSlotCoachCreateSchema = z.object({
    slot_id: z.string(),
    coach_id: z.string(),
})

export type EventSlotCoachCreateData = z.infer<typeof EventSlotCoachCreateSchema>;