"use server"

import { RoutineListData, RoutineListDataSchema } from "@/schemas/routine.schema";
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