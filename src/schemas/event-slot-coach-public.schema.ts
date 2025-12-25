import { z } from "zod";

export const ApiSlotCoachPublicListDataSchema = z.object({
    id: z.uuid(),
    slot_id: z.uuid(),
    coach_id: z.uuid().nullable(),
    coach: z.object({
        name: z.string(),
    }).nullable(),
})

export const EventSlotCoachPublicListItemDataSchema = ApiSlotCoachPublicListDataSchema.transform((apiData) => {
    return {
        id: apiData.id,
        slotId: apiData.slot_id,
        coachId: apiData.coach_id,
        coachName: apiData.coach?.name,
    }
})

export const EventSlotCoachPublicListDataSchema = z.array(EventSlotCoachPublicListItemDataSchema);
