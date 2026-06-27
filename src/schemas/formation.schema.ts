import { ApiFormationPositionSchema, FormationPositionListDataSchema } from "@/schemas/formation-position.model";
import { z } from "zod";

const ApiFormationSchema = z.object({
    id: z.uuid(),
    routine_id: z.uuid(),
    sort_index: z.int(),
    name: z.string().nullable(),
    athlete_positions: z.array(ApiFormationPositionSchema),
    created_at: z.coerce.date(),
});

export const FormationItemDataSchema = ApiFormationSchema.transform((apiData) => {
    return {
        id: apiData.id,
        routineId: apiData.routine_id,
        sortIndex: apiData.sort_index,
        name: apiData.name,
        athletePositions: FormationPositionListDataSchema.parse(apiData.athlete_positions) ?? [],
        createdAt: apiData.created_at,
    };
});

export const FormationListDataSchema = z.array(FormationItemDataSchema);

export type FormationItemData = z.infer<typeof FormationItemDataSchema>;


/* Create */
export const FormationCreateSchema = z.object({
    routine_id: z.string(),
    name: z.string().nullable(),
});

export type FormationClientCreateData = z.infer<typeof FormationCreateSchema>;