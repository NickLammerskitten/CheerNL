"use server"

import { FormationPositionUpdateData, FormationPositionUpdateSchema } from "@/schemas/formation-position.model";
import {
    FormationClientCreateData,
    FormationCreateSchema,
    FormationItemData,
    FormationListDataSchema,
} from "@/schemas/formation.schema";
import {
    RoutineAthleteCreateData,
    RoutineAthleteCreateSchema,
    RoutineAthleteItemData,
    RoutineAthleteListDataSchema,
    RoutineAthleteUpdateData,
    RoutineAthleteUpdateSchema,
} from "@/schemas/routine-athlete.schema";
import {
    RoutineCollaboratorCreateData,
    RoutineCollaboratorCreateSchema,
    RoutineCollaboratorItemData,
    RoutineCollaboratorItemDataSchema,
    RoutineCollaboratorListDataSchema,
} from "@/schemas/routine-collaborator.schema";
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

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
        console.error("Current User not found. ", userError);
        throw new Error("Error fetching user data");
    }

    const user_id = userData.user.id;

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

    const enrichedData = {
        ...data,
        is_owner: data.owner_id === user_id
    };

    try {
        return RoutineDetailDataSchema.parse(enrichedData)
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

export async function fetchRoutineCollaborators(routineId: string): Promise<RoutineCollaboratorItemData[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('routine_collaborator')
        .select(`*`)
        .eq('routine_id', routineId);

    if (error) {
        throw new Error(`Supabase-Fehler: ${error.message}`);
    }

    try {
        return RoutineCollaboratorListDataSchema.parse(data)
    } catch (validationError) {
        console.error("Zod Validierungsfehler:", validationError);
        throw new Error("Ungültige Daten von der API empfangen.");
    }
}

export async function addRoutineCollaborator(newData: RoutineCollaboratorCreateData): Promise<UpsertResponseSchema> {
    const dataValid = RoutineCollaboratorCreateSchema.safeParse(newData).success;
    if (!dataValid) {
        return {
            success: false,
            id: null,
            error: 'Die Daten konnten nicht validiert werden',
        };
    }

    const supabase = await createClient();
    const { data, status, statusText } = await supabase
        .from('routine_collaborator')
        .insert(newData)
        .select(`*`)
        .single()

    if (status !== 200 && status !== 201) {
        return {
            success: false,
            id: null,
            error: `Es ist ein Fehler aufgetreten: ${status} - ${statusText}`,
        }
    }

    const savedData = RoutineCollaboratorItemDataSchema.parse(data);

    return {
        success: true,
        id: savedData.id,
        error: null,
    };
}

export async function removeRoutineCollaborator(id: string) {
    const supabase = await createClient();
    const { status, statusText } = await supabase
        .from('routine_collaborator')
        .delete()
        .eq('id', id);

    if (status !== 204) {
        throw new Error(`Beim Löschen ist ein Fehler aufgetreten: ${status} - ${statusText}`)
    }
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

export async function addFormation(newData: FormationClientCreateData): Promise<UpsertResponseSchema> {
    const dataValid = FormationCreateSchema.safeParse(newData)
    if (!dataValid.success) {
        return {
            success: false,
            id: null,
            error: 'Die Daten konnten nicht validiert werden',
        }
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('routine_formation')
        .insert(newData)
        .select('id')
        .single();

    if (error) {
        return {
            success: false,
            id: null,
            error: error.message,
        }
    } else {
        return {
            success: true,
            id: data.id,
            error: null,
        }
    }
}

export async function fetchAthleteList(routineId: string): Promise<RoutineAthleteItemData[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('routine_athlete')
        .select(`*`)
        .eq('routine_id', routineId)
        .order('index', { ascending: true })

    if (error) {
        throw new Error(`Supabase-Fehler: ${error.message}`);
    }

    try {
        return RoutineAthleteListDataSchema.parse(data)
    } catch (validationError) {
        console.error("Zod Validierungsfehler:", validationError);
        throw new Error("Ungültige Daten von der API empfangen.");
    }
}

export async function saveAthlete(newData: RoutineAthleteCreateData | RoutineAthleteUpdateData): Promise<UpsertResponseSchema> {
    const dataValid = RoutineAthleteCreateSchema.safeParse(newData).success || RoutineAthleteUpdateSchema.safeParse(newData).success
    if (!dataValid) {
        return {
            success: false,
            id: null,
            error: 'Die Daten konnten nicht validiert werden',
        } as UpsertResponseSchema;
    }

    const supabase = await createClient();
    const { data, status, statusText } = await supabase
        .from('routine_athlete')
        .upsert(newData)
        .select('id')
        .single();

    if (status !== 200 && status !== 201) {
        return {
            success: false,
            id: null,
            error: `Es ist ein Fehler aufgetreten: ${status} - ${statusText}`,
        }
    }

    return {
        success: true,
        id: data?.id,
        error: null,
    };
}

export async function updateAthletePosition(
    athletePositionId: string,
    newData: FormationPositionUpdateData,
): Promise<UpsertResponseSchema> {
    const dataValid = FormationPositionUpdateSchema.safeParse(newData)
    if (!dataValid.success) {
        return {
            success: false,
            id: null,
            error: "Die Daten konnten nicht validiert werden",
        }
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('routine_formation_position')
        .update(newData)
        .eq('id', athletePositionId)
        .select('id')
        .single();

    if (error) {
        return {
            success: false,
            id: null,
            error: error.message,
        }
    } else {
        return {
            success: true,
            id: data.id,
            error: null,
        }
    }
}
