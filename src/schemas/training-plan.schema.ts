import { z } from "zod";

const GOOGLE_DRIVE_ID_REGEX = /^[a-zA-Z0-9_-]+$/;

const ApiDataSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    // if plan is deleted in google drive, it needs to be null
    google_drive_file_id: z.string().nullable(),
    created_at: z.coerce.date(),
});

export const TrainingPlanListItemDataSchema = ApiDataSchema.transform((apiData) => {
    return {
        id: apiData.id,
        name: apiData.name,
        googleDriveFileId: apiData.google_drive_file_id,
        createdAt: apiData.created_at,
    }
})

export const TrainingPlanListDataSchema = z.array(TrainingPlanListItemDataSchema);

export type TrainingPlanListData = z.infer<typeof TrainingPlanListDataSchema>;

export type TrainingPlanDetailData = z.infer<typeof TrainingPlanListItemDataSchema>;

/* Create */
export const TrainingPlanCreateSchema = z.object({
    name: z.string(),
    google_drive_file_id: z.string()
        .regex(GOOGLE_DRIVE_ID_REGEX, "Ungültiges Format für eine Google Drive ID.")
        .min(25, "Die Google Drive File ID ist zu kurz (normalerweise ~33, mind. 25 Zeichen.)"),
})

export type TrainingPlanCreateData = z.infer<typeof TrainingPlanCreateSchema>;

/* Update */
export const TrainingPlanUpdateSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    google_drive_file_id: z.string()
        .regex(GOOGLE_DRIVE_ID_REGEX, "Ungültiges Format für eine Google Drive ID.")
        .min(25, "Die Google Drive File ID ist zu kurz (normalerweise ~33, mind. 25 Zeichen.)"),
})

export type TrainingPlanUpdateData = z.infer<typeof TrainingPlanUpdateSchema>;