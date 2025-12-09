import { z } from "zod";

const ApiDataSchema = z.object({
    id: z.uuid(),
    name: z.string(),
});

export const TeamPublicListItemDataSchema = ApiDataSchema.transform((apiData) => {
    return {
        id: apiData.id,
        name: apiData.name,
    };
});

export const TeamPublicListDataSchema = z.array(TeamPublicListItemDataSchema);

export type TeamPublicListData = z.infer<typeof TeamPublicListItemDataSchema>;