import { ApiTeamListDataSchema, TeamListItemDataSchema } from "@/schemas/team.schema";
import { z } from "zod";

const ApiDataSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1, { message: "Der Name darf nicht leer sein."}),
    team: ApiTeamListDataSchema.nullable(),
    created_at: z.coerce.date(),
})

export const RoutineListItemDataSchema = ApiDataSchema.transform((apiData) => {
    return {
        id: apiData.id,
        name: apiData.name,
        team: apiData.team && TeamListItemDataSchema.parse(apiData.team),
        createdAt: apiData.created_at,
    }
})

export const RoutineListDataSchema = z.array(RoutineListItemDataSchema);

export type RoutineListData = z.infer<typeof RoutineListItemDataSchema>

export const RoutineCreateSchema = z.object({
    name: z.string().min(1, { message: "Der Name darf nicht leer sein."}),
    team_id: z.uuid().nullable(),
})

export type RoutineCreateData = z.infer<typeof RoutineCreateSchema>;

export const RoutineUpdateSchema = RoutineCreateSchema;
export type RoutineUpdateData = z.infer<typeof RoutineUpdateSchema>;
