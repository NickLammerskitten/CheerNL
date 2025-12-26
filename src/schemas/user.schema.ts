import { z } from "zod";

const ApiDataSchema = z.object({
    id: z.uuid(),
    email: z.string().nullable(),
    role: z.string().nullable(),
    user_metadata: z.object({
        display_name: z.string().nullish(),
        email_verified: z.boolean().nullish(),
    }).nullable(),
    created_at: z.coerce.date(),
});

export const UserListItemDataSchema = ApiDataSchema.transform((apiData) => {
    return {
        id: apiData.id,
        email: apiData.email,
        role: apiData.role,
        displayName: apiData.user_metadata?.display_name ?? null,
        emailVerified: apiData.user_metadata?.email_verified ?? false,
        createdAt: apiData.created_at,
    }
})

export const UserListDataSchema = z.array(UserListItemDataSchema);

export type UserListData = z.infer<typeof UserListDataSchema>;