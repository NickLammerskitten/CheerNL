"use server"

import { CoachCreateData } from "@/schemas/coach.schema";
import { UserListData, UserListDataSchema } from "@/schemas/user.schema";
import { saveCoach } from "@/services/coach.api";
import { isPasswordStrong } from "@/utils/password-checker";
import { AdminUserAttributes, AuthError, createClient, SupabaseClient } from '@supabase/supabase-js'

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
    displayName: string | undefined,
    isCoach: boolean,
): Promise<string | null> {
    const passwordValid = isPasswordStrong(password);
    if (!passwordValid) {
        return "Das Passwort erfüllt nicht die Kriterien.";
    }

    const supabase = await createAdminClient()

    let createData = {
        email_confirm: true,
        email: email,
        password: password,
    } as AdminUserAttributes

    if (displayName && displayName.length > 0) {
        createData = {
            ...createData,
            user_metadata: { display_name: displayName },
        }
    }

    const { data, error } = await supabase.auth.admin.createUser(createData)

    if (error) {
        return error.message;
    }

    if (isCoach && data.user) {
        const coachData = {
            user_id: data.user.id,
            name: displayName,
        } as CoachCreateData;

        const response = await saveCoach(coachData);

        if (!response.success) {
            return response.error;
        }
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

//@Role Admin
export async function resetPasswort(id: string, newPassword: string): Promise<string | null> {
    const passwordValid = isPasswordStrong(newPassword);
    if (!passwordValid) {
        return "Das Passwort erfüllt nicht die Kriterien.";
    }

    const supabase = await createAdminClient()

    const { error } = await supabase.auth.admin.updateUserById(id, { password: newPassword })

    if (error) {
        return error.message;
    }

    return null
}