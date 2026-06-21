import { z } from "zod";

const ApiFormationSchema = z.object({
    id: z.uuid(),
    routine_id: z.uuid(),
    sort_index: z.int(),
    name: z.string(),
    created_at: z.coerce.date(),
});

export const FormationItemDataSchema = ApiFormationSchema.transform((apiData) => {
    return {
        id: apiData.id,
        routineId: apiData.routine_id,
        sortIndex: apiData.sort_index,
        name: apiData.name,
        createdAt: apiData.created_at,
    };
});

export const FormationListDataSchema = z.array(FormationItemDataSchema);

export type FormationItemData = z.infer<typeof FormationItemDataSchema>;