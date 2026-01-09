import {
    CreateTrainingPlanAthleteActivity,
    CreateTrainingPlanAthleteActivityListDataSchema,
    TrainingPlanAthleteActivity,
    TrainingPlanAthleteActivityListDataSchema,
} from "@/schemas/training-plan-athlete-activity.schema";
import { UpsertResponseSchema } from "@/schemas/upsert-response.schema";
import { listDriveActivities } from "@/services/external/google-drive-activities.api";
import { fetchTrainingPlanAthlete } from "@/services/training-plan-athlete.api";
import { createClient } from "@/utils/supabase/server";
import { addHours, isAfter } from "date-fns";

export async function fetchActivities(trainingPlanAthleteId: string): Promise<TrainingPlanAthleteActivity[]> {
    const latestSync = await fetchLatestSync(trainingPlanAthleteId);
    if (newSyncNecessary(latestSync)) {
        await performImport(trainingPlanAthleteId, latestSync);
    }

    const supabase = await createClient();

    const { data: rawData, error } = await supabase.from('training_plan_athlete_activity')
        .select('*')
        .eq('training_plan_athlete_id', trainingPlanAthleteId)
        .order('created_at');

    if (error) {
        throw new Error(`Supabase-Fehler: ${error.message}`);
    }

    try {
        return TrainingPlanAthleteActivityListDataSchema.parse(rawData);
    } catch (validationError) {
        console.error("Zod Validierungsfehler:", validationError);
        throw new Error("Ungültige Daten von der API empfangen.");
    }
}

export async function fetchLatestSync(trainingPlanAthleteId: string): Promise<Date | null> {
    const supabase = await createClient();

    const { data, error } = await supabase.from('training_plan_athlete_activity')
        .select()
        .eq('training_plan_athlete_id', trainingPlanAthleteId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error || !data) {
        return null;
    }

    return data.created_at;
}

function newSyncNecessary(latestSync: Date | null): boolean {
    if (!latestSync) {
        return true;
    }

    const now = new Date();
    const nextSyncTime = addHours(latestSync, 1);

    return isAfter(now, nextSyncTime);
}

async function performImport(trainingPlanAthleteId: string, importFrom: Date | null): Promise<UpsertResponseSchema> {
    const trainingPlanAthlete = await fetchTrainingPlanAthlete(trainingPlanAthleteId);
    const googleDriveFolderId = trainingPlanAthlete.googleDriveFolderId;

    if (!googleDriveFolderId) {
        return {
            success: true,
            id: null,
            error: null,
        }
    }

    let nextPageToken = null;
    const data: CreateTrainingPlanAthleteActivity[] = [];

    try {
        do {
            const activitiesResponse = await listDriveActivities(googleDriveFolderId, trainingPlanAthleteId, importFrom);

            data.push(...activitiesResponse.data);
            nextPageToken = activitiesResponse.nextPageToken;
        } while (nextPageToken);

        // @ts-expect-error: No specific error type due to missing docs
    } catch (e: Error) {
        console.error('Es ist ein Fehler beim Import aufgetreten', e.message);
        return {
            success: false,
            id: null,
            error: 'Drive Activities konnten nicht importiert werden ' + e.message,
        }
    }

    if (data.length > 0) {
        return await saveActivities(data);
    } else {
        return {
            success: true,
            id: null,
            error: null,
        }
    }
}

export async function saveActivities(newData: CreateTrainingPlanAthleteActivity[]): Promise<UpsertResponseSchema> {
    const dataValid = CreateTrainingPlanAthleteActivityListDataSchema.safeParse(newData);

    if (!dataValid.success) {
        return {
            success: false,
            id: null,
            error: 'Die Daten konnten nicht validiert werden',
        }
    }

    const supabase = await createClient();

    const { status, statusText } = await supabase
        .from('training_plan_athlete_activity')
        .upsert(newData);

    if (status !== 200 && status !== 201) {
        return {
            success: false,
            id: null,
            error: `Es ist ein Fehler aufgetreten: ${status} - ${statusText}`,
        }
    }

    return {
        success: true,
        id: null,
        error: null,
    }
}