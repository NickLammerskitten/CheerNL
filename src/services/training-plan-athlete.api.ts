"use server"

import {
    TrainingPlanAthleteCreateData,
    TrainingPlanAthleteCreateSchema,
    TrainingPlanAthleteListData,
    TrainingPlanAthleteListDataSchema,
    TrainingPlanAthleteListItemData,
    TrainingPlanAthleteListItemDataSchema,
    TrainingPlanAthleteUpdateData,
    TrainingPlanAthleteUpdateSchema,
} from "@/schemas/training-plan-athlete.schema";
import { TrainingPlanListItemData } from "@/schemas/training-plan.schema";
import { UpsertResponseSchema } from "@/schemas/upsert-response.schema";
import { createAthleteFolder, deleteFolder } from "@/services/external/google-drive-files.api";
import { fetchTrainingPlan } from "@/services/training-plan.api";
import { createClient } from "@/utils/supabase/server";
import {fullTextSearchToSupabaseQuery} from "@/utils/full-text-search-to-supabase-query";

interface PaginatedTrainingPlanAthleteListResponse {
    data: TrainingPlanAthleteListData;
    totalCount?: number;
}

export async function fetchTrainingPlanAthleteList(page: number, pageSize: number, fullTextSearch?: string): Promise<PaginatedTrainingPlanAthleteListResponse> {
    const supabase = await createClient();

    const from = (page - 1) * pageSize;
    const to = page * pageSize - 1;

    let query = supabase
        .from('training_plan_athlete')
        .select('*, training_plan(name)')
        .range(from, to)
        .order('created_at', { ascending: false });

    if (fullTextSearch) {
        const parsedQuery = fullTextSearchToSupabaseQuery(fullTextSearch);
        query = query.textSearch('training_plan_athlete_full_name', parsedQuery);
    }

    const { data: rawData, error, count } = await query


    if (error) {
        console.error(`Supabase-Fehler: ${error.message}`);
        return { data: [], totalCount: undefined };
    }

    try {
        const parsedData = TrainingPlanAthleteListDataSchema.parse(rawData);

        return {
            data: parsedData,
            totalCount: count ?? 0
        }
    } catch (validationError) {
        console.error("Zod Validierungsfehler:", validationError);
        throw new Error("Ungültige Daten von der API empfangen.");
    }
}

export async function fetchTrainingPlanAthlete(id: string): Promise<TrainingPlanAthleteListItemData> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('training_plan_athlete')
        .select('*, training_plan(name)')
        .eq('id', id)
        .single();

    if (error) {
        throw new Error(`Supabase-Fehler: ${error.message}`);
    }

    try {
        return TrainingPlanAthleteListItemDataSchema.parse(data);
    } catch (validationError) {
        console.error("Zod Validierungsfehler:", validationError);
        throw new Error("Ungültige Daten von der API empfangen.");
    }
}

export async function saveTrainingPlanAthlete(newData: TrainingPlanAthleteUpdateData | TrainingPlanAthleteCreateData): Promise<UpsertResponseSchema> {
    const dataValid = TrainingPlanAthleteUpdateSchema.safeParse(newData).success || TrainingPlanAthleteCreateSchema.safeParse(newData).success;

    if (!dataValid) {
        return {
            success: false,
            id: null,
            error: 'Die Daten konnten nicht validiert werden',
        };
    }

    const trainingPlan = await fetchTrainingPlan(newData.training_plan_id);
    const trainingPlanValid = trainingPlan.googleDriveFileId !== null;
    if (!trainingPlanValid) {
        return {
            success: false,
            id: null,
            error: 'Dem ausgewählten Trainingsplan fehlt eine zugewiesene Datei.',
        };
    }

    const supabase = await createClient();
    const { data, status, statusText } = await supabase
        .from('training_plan_athlete')
        .upsert(newData)
        .select('*, training_plan(name)')
        .single()

    if (status !== 200 && status !== 201) {
        return {
            success: false,
            id: null,
            error: `Es ist ein Fehler aufgetreten: ${status} - ${statusText}`,
        }
    }

    const savedData = TrainingPlanAthleteListItemDataSchema.parse(data);

    // No folder exists
    let createdFolderId;
    if (!savedData.googleDriveFolderId) {
        try {
            createdFolderId = await handleExternalAthleteCreation(savedData, trainingPlan);
            // @ts-expect-error: No specific error type due to missing docs
        } catch (driveError: Error) {
            await supabase
                .from('training_plan_athlete')
                .delete()
                .eq('id', savedData.id);

            return {
                success: false,
                id: null,
                error: `Fehler bei Google Drive Einrichtung: ${driveError.message}. Eintrag wurde zurückgerollt.`,
            };
        }
    }

    if (createdFolderId) {
        await supabase
            .from('training_plan_athlete')
            .update({ google_drive_folder_id: createdFolderId })
            .eq('id', savedData.id);
    }

    return {
        success: true,
        id: savedData.id,
        error: null,
    };
}

async function handleExternalAthleteCreation(
    trainingPlanAthlete: TrainingPlanAthleteListItemData,
    trainingPlan: TrainingPlanListItemData,
): Promise<string> {
    if (!trainingPlan.googleDriveFileId) {
        throw new Error("Invalid Training Plan.");
    }

    const athleteName = trainingPlanAthlete.firstName + " " + trainingPlanAthlete.lastName;
    return await createAthleteFolder(athleteName, trainingPlanAthlete.googleEmailAddress);
}

export async function deleteTrainingPlanAthlete(id: string) {
    const supabase = await createClient();

    const { data: rawData } = await supabase
        .from('training_plan_athlete')
        .select('*, training_plan(name)')
        .eq('id', id)

    const athlete = TrainingPlanAthleteListItemDataSchema.parse(rawData);

    try {
        await handleExternalAthleteDeletion(athlete);
        // @ts-expect-error: No specific error type due to missing docs
    } catch (driveError: Error) {
        console.error("Fehler beim Löschen eines Google Drive Ordners ", driveError.message);
    }

    const { status, statusText } = await supabase
        .from('training_plan_athlete')
        .delete()
        .eq('id', id);

    if (status !== 204) {
        throw new Error(`Beim Löschen ist ein Fehler aufgetreten: ${status} - ${statusText}`)
    }
}

async function handleExternalAthleteDeletion(athlete: TrainingPlanAthleteListItemData) {
    const folderId = athlete.googleDriveFolderId;

    if (!folderId) {
        return;
    }

    await deleteFolder(folderId)
}
