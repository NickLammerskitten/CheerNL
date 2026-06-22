import { z } from "zod";

const ApiRoutineAthleteSchema = z.object({
    id: z.uuid(),
    routine_id: z.uuid(),
    name: z.string(),
    created_at: z.coerce.date(),
});

export const RoutineAthleteItemDataSchema = ApiRoutineAthleteSchema.transform((apiData) => {
    return {
        id: apiData.id,
        routineId: apiData.routine_id,
        name: apiData.name,
        createdAt: apiData.created_at,
    };
});

export const RoutineAthleteListDataSchema = z.array(RoutineAthleteItemDataSchema);

export type RoutineAthleteItemData = z.infer<typeof RoutineAthleteItemDataSchema>;