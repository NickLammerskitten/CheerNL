import { TeamListData, TeamListDataSchema } from "@/schemas/team.schema";
import { createClient } from "@/utils/supabase/server";

export async function fetchTeamList(): Promise<TeamListData[]> {
    const supabase = await createClient();
    const { data: rawData, error } = await supabase
        .from('team')
        .select('*');

    if (error) {
        throw new Error(`Supabase-Fehler: ${error.message}`);
    }

    try {
        return TeamListDataSchema.parse(rawData);
    } catch (validationError) {
        console.error("Zod Validierungsfehler:", validationError);
        throw new Error("Ungültige Daten von der API empfangen.");
    }
}

export async function fetchTeamCount(): Promise<number> {
    const supabase = await createClient();
    const { count } = await supabase
        .from('team')
        .select('*', { count: 'exact', head: true })

    return count ?? 0
}