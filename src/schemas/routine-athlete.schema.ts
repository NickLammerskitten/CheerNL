import { z } from "zod";

export const ApiRoutineAthleteSchema = z.object({
    id: z.uuid(),
    routine_id: z.uuid(),
    name: z.string().nullable(),
    index: z.int(),
    created_at: z.coerce.date(),
});

export const RoutineAthleteItemDataSchema = ApiRoutineAthleteSchema.transform((apiData) => {
    return {
        id: apiData.id,
        routineId: apiData.routine_id,
        name: apiData.name,
        index: apiData.index,
        createdAt: apiData.created_at,
    };
});

export const RoutineAthleteListDataSchema = z.array(RoutineAthleteItemDataSchema);

export type RoutineAthleteItemData = z.infer<typeof RoutineAthleteItemDataSchema>;

/* Create */
export const RoutineAthleteCreateSchema = z.object({
    name: z.string().nullable(),
    routine_id: z.uuid(),
})

export type RoutineAthleteCreateData = z.infer<typeof RoutineAthleteCreateSchema>;

/* Update */
export const RoutineAthleteUpdateSchema = z.object({
    id: z.uuid(),
    routine_id: z.uuid(),
    name: z.string().nullable(),
})

export type RoutineAthleteUpdateData = z.infer<typeof RoutineAthleteUpdateSchema>;
