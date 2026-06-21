import { z } from "zod";

const ApiFormationPositionSchema = z.object({
    formation_id: z.uuid(),
    routine_athlete_id: z.uuid(),
    pos_x: z.number(),
    pos_y: z.number(),
});

export const FormationPositionItemDataSchema = ApiFormationPositionSchema.transform((apiData) => {
    return {
        formationId: apiData.formation_id,
        routineAthleteId: apiData.routine_athlete_id,
        posX: apiData.pos_x,
        posY: apiData.pos_y,
    };
});

export const FormationPositionListDataSchema = z.array(FormationPositionItemDataSchema);

export type FormationPositionItemData = z.infer<typeof FormationPositionItemDataSchema>;