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
