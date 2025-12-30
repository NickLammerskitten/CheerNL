"use server"

import {
    TrainingPlanCreateData,
    TrainingPlanCreateSchema, TrainingPlanDetailData,
    TrainingPlanListData,
    TrainingPlanListDataSchema,
    TrainingPlanListItemDataSchema,
    TrainingPlanUpdateData,
    TrainingPlanUpdateSchema,
} from "@/schemas/training-plan.schema";
import { UpsertResponseSchema } from "@/schemas/upsert-response.schema";
import { getFile } from "@/services/google-drive/google-drive-files.api";
import { createClient } from "@/utils/supabase/server";

export async function fetchTrainingPlanList(): Promise<TrainingPlanListData> {
    const supabase = await createClient();

    const { data: rawData, error } = await supabase
        .from('training_plan')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Supabase-Fehler: ${error.message}`);
    }

    try {
        return TrainingPlanListDataSchema.parse(rawData);
    } catch (validationError) {
        console.error("Zod Validierungsfehler:", validationError);
        throw new Error("Ungültige Daten von der API empfangen.");
    }
}

export async function fetchTrainingPlan(id: string): Promise<TrainingPlanDetailData> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('training_plan')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        throw new Error(`Supabase-Fehler: ${error.message}`);
    }

    try {
        return TrainingPlanListItemDataSchema.parse(data);
    } catch (validationError) {
        console.error("Zod Validierungsfehler:", validationError);
        throw new Error("Ungültige Daten von der API empfangen.");
    }
}

export async function saveTrainingPlan(newData: TrainingPlanUpdateData | TrainingPlanCreateData): Promise<UpsertResponseSchema> {
    const dataValid = TrainingPlanUpdateSchema.safeParse(newData).success || TrainingPlanCreateSchema.safeParse(newData).success;

    if (!dataValid) {
        return {
            success: false,
            id: null,
            error: 'Die Daten konnten nicht validiert werden',
        };
    }

    const file = await getFile(newData.google_drive_file_id);
    if (!file) {
        return {
            success: false,
            id: null,
            error: `Die Datei mit der ID ${newData.google_drive_file_id} konnte nicht gefunden werden.`,
        };
    }

    const supabase = await createClient();
    const { data, status, statusText } = await supabase
        .from('training_plan')
        .upsert(newData)
        .select('*')
        .single()

    if (status !== 200 && status !== 201) {
        return {
            success: false,
            id: null,
            error: `Es ist ein Fehler aufgetreten: ${status} - ${statusText}`,
        }
    }

    const savedData = TrainingPlanListItemDataSchema.parse(data);

    return {
        success: true,
        id: savedData.id,
        error: null,
    };
}

// TODO: Delete file in Google Drive
export async function deleteTrainingPlan(id: string) {
    const supabase = await createClient();
    const { status, statusText } = await supabase
        .from('training_plan')
        .delete()
        .eq('id', id);

    if (status !== 204) {
        throw new Error(`Beim Löschen ist ein Fehler aufgetreten: ${status} - ${statusText}`)
    }
}
