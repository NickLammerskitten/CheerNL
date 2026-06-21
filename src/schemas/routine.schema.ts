import { ApiTeamListDataSchema, TeamListItemDataSchema } from "@/schemas/team.schema";
import { z } from "zod";

const ApiDataSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    team: z.object(ApiTeamListDataSchema),
    created_at: z.coerce.date(),
})

export const RoutineListItemDataSchema = ApiDataSchema.transform((apiData) => {
    return {
        id: apiData.id,
        name: apiData.name,
        team: TeamListItemDataSchema.parse(apiData.team),
        createdAt: apiData.created_at,
    }
})

export const RoutineListDataSchema = z.array(RoutineListItemDataSchema);

export type RoutineListData = z.infer<typeof RoutineListItemDataSchema>