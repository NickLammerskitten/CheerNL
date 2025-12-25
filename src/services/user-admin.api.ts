"use server"

import { UserListData, UserListDataSchema } from "@/schemas/user.schema";
import { AuthError, createClient, SupabaseClient } from '@supabase/supabase-js'

async function createAdminClient(): Promise<SupabaseClient> {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PRIVATE_SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
            },
        },
    );
}

//@Role Admin
export async function fetchAllUsers(): Promise<UserListData> {
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

//@Role Admin
export async function createUser(
    email: string,
    password: string,
    displayName: string,
): Promise<AuthError | null> {
    const supabase = await createAdminClient()

    const { error } = await supabase.auth.admin.createUser({
        email_confirm: true,
        email: email,
        password: password,
        user_metadata: { display_name: displayName },
    })

    if (error) {
        return error
    }

    return null
}

//@Role Admin
export async function deleteUser(id: string): Promise<AuthError | null> {
    const supabase = await createAdminClient()

    const { error } = await supabase.auth.admin.deleteUser(id)

    if (error) {
        return error
    }

    return null
}