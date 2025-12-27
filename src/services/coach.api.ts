import {
    CoachCreateData,
    CoachCreateSchema,
    CoachListData,
    CoachListDataSchema,
    CoachListItemDataSchema,
} from "@/schemas/coach.schema";
import { UpsertResponseSchema } from "@/schemas/upsert-response.schema";
import { createClient } from "@/utils/supabase/server";

export async function fetchCoachList(): Promise<CoachListData[]> {
    const supabase = await createClient();
    const { data: rawData, error } = await supabase
        .from('coach')
        .select(`
            *,
            coach_assignment(
                *,
                team(name)
            )
        `);

    if (error) {
        throw new Error(`Supabase-Fehler: ${error.message}`);
    }

    try {
        return CoachListDataSchema.parse(rawData)
            .sort((a, b) => a.name > b.name ? 1 : -1);
    } catch (validationError) {
        console.error("Zod Validierungsfehler:", validationError);
        throw new Error("Ungültige Daten von der API empfangen.");
    }
}

export async function fetchCoachCount(): Promise<number> {
    const supabase = await createClient();
    const { count } = await supabase
        .from('coach, ')
        .select('', { count: 'exact', head: true })

    return count ?? 0
}

export async function saveCoach(newData: CoachCreateData): Promise<UpsertResponseSchema> {
    const dataValid = CoachCreateSchema.safeParse(newData).success
    if (!dataValid) {
        return {
            success: false,
            id: null,
            error: 'Die Daten konnten nicht validiert werden',
        };
    }

    const supabase = await createClient();
    const { data, status, statusText } = await supabase
        .from('coach')
        .upsert(newData)
        .select(`
            *,
            coach_assignment(
                *,
                team(name)
            )
        `)
        .single()

    if (status !== 200 && status !== 201) {
        return {
            success: false,
            id: null,
            error: `Es ist ein Fehler aufgetreten: ${status} - ${statusText}`,
        }
    }

    const savedData = CoachListItemDataSchema.parse(data);

    return {
        success: true,
        id: savedData.id,
        error: null,
    };
}
