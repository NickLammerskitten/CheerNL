import { UserListDataSchema } from "@/schemas/user.schema";
import { createClient, SupabaseClient } from '@supabase/supabase-js'

async function createAdminClient(): Promise<SupabaseClient> {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SECREAT_KEY!,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
            },
        },
    );

}

export async function fetchAllUsers() {
    const supabase = await createAdminClient()
    const { data: users, error } = await supabase.auth.admin.listUsers()

    if (error) {
        throw new Error(`Supabase-Fehler: ${error.message}`);
    }

    try {
        return UserListDataSchema.parse(users.users);
    } catch (validationError) {
        console.error("Zod Validierungsfehler:", validationError);
        throw new Error("Ungültige Daten von der API empfangen.");
    }
}
