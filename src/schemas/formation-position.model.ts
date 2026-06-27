import { ApiRoutineAthleteSchema, RoutineAthleteItemDataSchema } from "@/schemas/routine-athlete.schema";
import { z } from "zod";

export const ApiFormationPositionSchema = z.object({
    id: z.uuid(),
    routine_formation_id: z.uuid(),
    athlete: ApiRoutineAthleteSchema,
    pos_x: z.number(),
    pos_y: z.number(),
});

export const FormationPositionItemDataSchema = ApiFormationPositionSchema.transform((apiData) => {
    return {
        id: apiData.id,
        formationId: apiData.routine_formation_id,
        athlete: RoutineAthleteItemDataSchema.parse(apiData.athlete),
        posX: apiData.pos_x,
        posY: apiData.pos_y,
    };
});

export const FormationPositionListDataSchema = z.array(FormationPositionItemDataSchema);

export type FormationPositionItemData = z.infer<typeof FormationPositionItemDataSchema>;

/* Update */
export const FormationPositionUpdateSchema = z.object({
    pos_x: z.number(),
    pos_y: z.number(),
})

export type FormationPositionUpdateData = z.infer<typeof FormationPositionUpdateSchema>;
