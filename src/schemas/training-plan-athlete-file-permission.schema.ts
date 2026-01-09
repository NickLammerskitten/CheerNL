import {z} from "zod";

export const FilePermissionListItemDataSchema = z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    emailAddress: z.string().nullable(),
    role: z.string().nullable(),
    photoLink: z.string().nullable(),
})

export type FilePermissionListItemData = z.infer<typeof FilePermissionListItemDataSchema>;