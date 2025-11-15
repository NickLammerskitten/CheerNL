import { z } from "zod";

const ApiDataSchema = z.object({
    id: z.uuid(),
    email: z.string().nullable(),
    role: z.string().nullable(),
    created_at: z.coerce.date(),
});

export const UserListItemDataSchema = ApiDataSchema.transform((apiData) => {
    return {
        id: apiData.id,
        email: apiData.email,
        role: apiData.role,
        createdAt: apiData.created_at,
    }
})

export const UserListDataSchema = z.array(UserListItemDataSchema);

export type UserListData = z.infer<typeof UserListDataSchema>;