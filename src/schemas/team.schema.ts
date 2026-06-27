import { z } from 'zod';

export const ApiTeamListDataSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    created_at: z.coerce.date(),
});

export const TeamListItemDataSchema = ApiTeamListDataSchema.transform((apiData) => {
    return {
        id: apiData.id,
        name: apiData.name,
        createdAt: apiData.created_at,
    };
});

export const TeamListDataSchema = z.array(TeamListItemDataSchema);

export type TeamListData = z.infer<typeof TeamListItemDataSchema>;