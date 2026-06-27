import { z } from "zod";

const ApiSchema = z.object({
    id: z.uuid(),
    routine_id: z.uuid(),
    user_id: z.uuid(),
    created_at: z.coerce.date()
})

export const RoutineCollaboratorItemDataSchema = ApiSchema.transform((apiData) => {
    return {
        id: apiData.id,
        routineId: apiData.routine_id,
        userId: apiData.user_id,
        createdAt: apiData.created_at
    }
})

export const RoutineCollaboratorListDataSchema = z.array(RoutineCollaboratorItemDataSchema);

export type RoutineCollaboratorItemData = z.infer<typeof RoutineCollaboratorItemDataSchema>;

/* Create */
export const RoutineCollaboratorCreateSchema = z.object({
    routine_id: z.uuid(),
    user_id: z.uuid(),
})

export type RoutineCollaboratorCreateData = z.infer<typeof RoutineCollaboratorCreateSchema>;