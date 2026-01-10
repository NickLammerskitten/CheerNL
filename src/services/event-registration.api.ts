"use server"

import { createClient } from "@/utils/supabase/server";

export default async function deleteEventRegistration(id: string) {
    const supabase = await createClient();
    const { status, statusText } = await supabase
        .from('event_registration')
        .delete()
        .eq('id', id);

    if (status !== 204) {
        throw new Error(`Beim Löschen ist ein Fehler aufgetreten: ${status} - ${statusText}`)
    }
}