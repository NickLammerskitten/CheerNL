import { z } from "zod";

export const ApiCoachAssignmentListDataSchema = z.object({
    id: z.uuid(),
    coach_id: z.uuid(),
    team_id: z.uuid(),
    team: z.object({
        name: z.string(),
    }).nullable(),
})

export const CoachAssignmentListItemDataSchema = ApiCoachAssignmentListDataSchema.transform((apiData) => {
    return {
        id: apiData.id,
        coachId: apiData.coach_id,
        teamId: apiData.team_id,
        teamName: apiData.team?.name ?? 'Unbekanntes Team',
    }
})

export const CoachAssignmentListDataSchema = z.array(CoachAssignmentListItemDataSchema);

export const CoachAssignmentCreateSchema = z.object({
    coach_id: z.string(),
    team_id: z.string(),
})

export type CoachAssignmentCreateData = z.infer<typeof CoachAssignmentCreateSchema>;
