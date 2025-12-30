import { GOOGLE_DRIVE_ID_REGEX } from "@/utils/google/google-drive-folder-id-validation";
import { z } from "zod";

const ApiDataSchema = z.object({
    id: z.uuid(),
    first_name: z.string(),
    last_name: z.string(),
    training_plan_id: z.uuid().nullable(),
    training_plan: z.object({
        name: z.string(),
    }),
    google_email_address: z.string(),
    // Id is null while creating process
    google_drive_folder_id: z.string().nullable(),
    created_at: z.coerce.date(),
});

export const TrainingPlanAthleteListItemDataSchema = ApiDataSchema.transform((apiData) => {
    return {
        id: apiData.id,
        firstName: apiData.first_name,
        lastName: apiData.last_name,
        trainingPlanId: apiData.training_plan_id,
        trainingPlanName: apiData.training_plan.name,
        googleEmailAddress: apiData.google_email_address,
        googleDriveFolderId: apiData.google_drive_folder_id,
        createdAt: apiData.created_at,
    }
})

export const TrainingPlanAthleteListDataSchema = z.array(TrainingPlanAthleteListItemDataSchema);

export type TrainingPlanAthleteListData = z.infer<typeof TrainingPlanAthleteListDataSchema>;

export type TrainingPlanAthleteListItemData = z.infer<typeof TrainingPlanAthleteListItemDataSchema>;

/* Create */
export const TrainingPlanAthleteCreateSchema = z.object({
    first_name: z.string().min(1, { message: "Der Vorname darf nicht leer sein." }),
    last_name: z.string().min(1, { message: "Der Nachname darf nicht leer sein." }),
    training_plan_id: z.uuid().min(1, { message: "Der Trainingsplan darf nicht leer sein." }),
    google_email_address: z.email({ message: "Die Email darf nicht leer sein." }),
});

export type TrainingPlanAthleteCreateData = z.infer<typeof TrainingPlanAthleteCreateSchema>;

/* Update */
export const TrainingPlanAthleteUpdateSchema = z.object({
    id: z.uuid(),
    first_name: z.string().min(1, { message: "Der Vorname darf nicht leer sein." }),
    last_name: z.string().min(1, { message: "Der Nachname darf nicht leer sein." }),
    training_plan_id: z.uuid().min(1, { message: "Der Trainingsplan darf nicht leer sein." }),
    google_drive_folder_id: z.string()
        .regex(GOOGLE_DRIVE_ID_REGEX, "Ungültiges Format für eine Google Drive ID.")
        .min(25, "Die Google Drive File ID ist zu kurz (normalerweise ~33, mind. 25 Zeichen.)"),
    google_email_address: z.email({ message: "Die Email darf nicht leer sein." }),
});

export type TrainingPlanAthleteUpdateData = z.infer<typeof TrainingPlanAthleteUpdateSchema>;
