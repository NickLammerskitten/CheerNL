import { TeamPublicListData, TeamPublicListDataSchema } from "@/schemas/team-public.schema";
import { createClient } from "@/utils/supabase/server";

export async function fetchTeamListPublic(): Promise<TeamPublicListData[]> {
    const supabase = await createClient();
    const { data: rawData, error } = await supabase
        .from('team')
        .select('*');

    if (error) {
        throw new Error(`Supabase-Fehler: ${error.message}`);
    }

    try {
        return TeamPublicListDataSchema.parse(rawData);
    } catch (validationError) {
        console.error("Zod Validierungsfehler:", validationError);
        throw new Error("Ungültige Daten von der API empfangen.");
    }
}