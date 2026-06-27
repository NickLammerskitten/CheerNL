"use server"

import { FormationPositionUpdateData, FormationPositionUpdateSchema } from "@/schemas/formation-position.model";
import { FormationClientCreateData, FormationItemData, FormationListDataSchema } from "@/schemas/formation.schema";
import { RoutineAthleteCreateData, RoutineAthleteCreateSchema } from "@/schemas/routine-athlete.schema";
import {
    RoutineCreateData,
    RoutineCreateSchema,
    RoutineDetailData,
    RoutineDetailDataSchema,
    RoutineListData,
    RoutineListDataSchema,
    RoutineListItemDataSchema,
    RoutineUpdateData,
    RoutineUpdateSchema,
} from "@/schemas/routine.schema";
import { UpsertResponseSchema } from "@/schemas/upsert-response.schema";
import { createClient } from "@/utils/supabase/server";

export async function fetchRoutineList(): Promise<RoutineListData[]> {
    const supabase = await createClient();
    const { data: rawData, error } = await supabase
        .from('routine')
        .select(`
            *,
            team(*)
        `);

    if (error) {
        throw new Error(`Supabase-Fehler: ${error.message}`);
    }

    try {
        return RoutineListDataSchema.parse(rawData)
            .sort((a, b) => a.name > b.name ? 1 : -1);
    } catch (validationError) {
        console.error("Zod Validierungsfehler:", validationError);
        throw new Error("Ungültige Daten von der API empfangen.");
    }
}

export async function fetchRoutine(id: string): Promise<RoutineDetailData> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('routine')
        .select(`
            *,
            team(*)
        `)
        .eq('id', id)
        .single();

    if (error) {
        throw new Error(`Supabase-Fehler: ${error.message}`);
    }

    try {
        return RoutineDetailDataSchema.parse(data)
    } catch (validationError) {
        console.error("Zod Validierungsfehler:", validationError);
        throw new Error("Ungültige Daten von der API empfangen.");
    }
}

export async function saveRoutine(newData: RoutineCreateData | RoutineUpdateData): Promise<UpsertResponseSchema> {
    const dataValid = RoutineCreateSchema.safeParse(newData).success || RoutineUpdateSchema.safeParse(newData).success;
    if (!dataValid) {
        return {
            success: false,
            id: null,
            error: 'Die Daten konnten nicht validiert werden',
        };
    }

    const supabase = await createClient();
    const { data, status, statusText } = await supabase
        .from('routine')
        .upsert(newData)
        .select(`
            *,
            team(*)
        `)
        .single()

    if (status !== 200 && status !== 201) {
        return {
            success: false,
            id: null,
            error: `Es ist ein Fehler aufgetreten: ${status} - ${statusText}`,
        }
    }

    const savedData = RoutineListItemDataSchema.parse(data);

    return {
        success: true,
        id: savedData.id,
        error: null,
    };
}

export async function fetchRoutineFormations(routineId: string): Promise<FormationItemData[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('routine_formation')
        .select(`
            *,
            athlete_positions: routine_formation_position(
                *,
                athlete: routine_athlete(*) 
            )
        `)
        .eq('routine_id', routineId)
        .order('sort_index', { ascending: true })

    if (error) {
        throw new Error(`Supabase-Fehler: ${error.message}`);
    }

    try {
        return FormationListDataSchema.parse(data)
    } catch (validationError) {
        console.error("Zod Validierungsfehler:", validationError);
        throw new Error("Ungültige Daten von der API empfangen.");
    }
}

export async function addFormation(newData: FormationClientCreateData): Promise<string | null> {
    const dataValid = RoutineCreateSchema.safeParse(newData)
    if (!dataValid) {
        return null;
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('routine_formation')
        .insert(newData)
        .select('id')
        .single();

    if (error) {
        return null;
    } else {
        return data.id;
    }
}

export async function addAthlete(newData: RoutineAthleteCreateData): Promise<string | null> {
    const dataValid = RoutineAthleteCreateSchema.safeParse(newData)
    if (!dataValid) {
        return null;
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('routine_athlete')
        .insert(newData)
        .select('id')
        .single();

    if (error) {
        return null;
    } else {
        return data.id;
    }
}

export async function updateAthletePosition(
    athletePositionId: string,
    newData: FormationPositionUpdateData,
): Promise<string | null> {
    const dataValid = FormationPositionUpdateSchema.safeParse(newData)
    if (!dataValid) {
        console.log(newData)
        return null;
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('routine_formation_position')
        .update(newData)
        .eq('id', athletePositionId)
        .select('id')
        .single();

    if (error) {
        return null;
    } else {
        return data.id;
    }
}
