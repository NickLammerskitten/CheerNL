import { z } from "zod";

// No more values needed
export const ActivityActionEnum = z.enum([
    'create',
    'edit',
    'rename',
    'unknown',
]);

const ApiDataSchema = z.object({
    id: z.uuid(),
    training_plan_athlete_id: z.uuid(),
    google_drive_folder_id: z.string(),

    timestamp: z.coerce.date(),

    action: ActivityActionEnum,

    actor: z.string(),

    file_id: z.string().nullable(),
    file_name: z.string(),
    file_mime_type: z.string().nullable(),
    file_link: z.string().nullable(),
})

export const TrainingPlanAthleteActivitySchema = ApiDataSchema.transform((apiData) => {
    return {
        id: apiData.id,
        trainingPlanAthleteId: apiData.training_plan_athlete_id,
        timestamp: apiData.timestamp,

        action: apiData.action,

        actor: apiData.actor,

        file: {
            id: apiData.file_id,
            name: apiData.file_name,
            mimeType: apiData.file_mime_type,
            link: apiData.file_link,
        },
    }
});

export const TrainingPlanAthleteActivityListDataSchema = z.array(TrainingPlanAthleteActivitySchema);

export type TrainingPlanAthleteActivity = z.infer<typeof TrainingPlanAthleteActivitySchema>;

/* Create */
export const CreateTrainingPlanAthleteActivitySchema = z.object({
    training_plan_athlete_id: z.uuid(),
    google_drive_folder_id: z.string(),
    timestamp: z.coerce.date(),

    action: ActivityActionEnum,

    actor: z.string(),

    file_id: z.string().nullable(),
    file_name: z.string(),
    file_mime_type: z.string().nullable(),
    file_link: z.string().nullable(),
})

export const CreateTrainingPlanAthleteActivityListDataSchema = z.array(CreateTrainingPlanAthleteActivitySchema);

export type CreateTrainingPlanAthleteActivity = z.infer<typeof CreateTrainingPlanAthleteActivitySchema>;
