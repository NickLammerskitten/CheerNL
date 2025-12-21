import { CoachListData, CoachListDataSchema } from "@/schemas/coach.schema";
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
        return CoachListDataSchema.parse(rawData);
    } catch (validationError) {
        console.error("Zod Validierungsfehler:", validationError);
        throw new Error("Ungültige Daten von der API empfangen.");
    }
}

export async function fetchCoachCount(): Promise<number> {
    const supabase = await createClient();
    const { count } = await supabase
        .from('coach')
        .select('', { count: 'exact', head: true })

    return count ?? 0
}