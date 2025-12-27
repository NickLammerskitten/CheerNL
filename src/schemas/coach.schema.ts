import { ApiCoachAssignmentListDataSchema, CoachAssignmentListDataSchema } from "@/schemas/coach-assignment.schema";
import { z } from 'zod';

const ApiDataSchema = z.object({
    id: z.uuid(),
    user_id: z.string(),
    name: z.string(),
    coach_assignment: z.array(ApiCoachAssignmentListDataSchema),
    created_at: z.coerce.date(),
});

export const CoachListItemDataSchema = ApiDataSchema.transform((apiData) => {
    return {
        id: apiData.id,
        userId: apiData.user_id,
        name: apiData.name,
        teams: CoachAssignmentListDataSchema.parse(apiData.coach_assignment),
        createdAt: apiData.created_at,
    };
});

export const CoachListDataSchema = z.array(CoachListItemDataSchema);

export type CoachListData = z.infer<typeof CoachListItemDataSchema>;


export const CoachCreateSchema = z.object({
    user_id: z.string(),
    name: z.string()
})

export type CoachCreateData = z.infer<typeof CoachCreateSchema>;