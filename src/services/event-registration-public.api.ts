"use server";

import {
    EventRegistrationPublicCreateSchema,
    EventRegistrationPublicData,
} from "@/schemas/event-registration-public.schema";
import { UpsertResponseSchema } from "@/schemas/upsert-response.schema";
import { createClient } from "@/utils/supabase/server";

export async function saveEventRegistration(newData: EventRegistrationPublicData): Promise<UpsertResponseSchema> {
    if (!EventRegistrationPublicCreateSchema.safeParse(newData).success) {
        return {
            success: false,
            id: null,
            error: 'Die Daten konnten nicht validiert werden',
        };
    }

    const supabase = await createClient();
    const { data, status, statusText } = await supabase
        .from('event_registration')
        .upsert(newData)
        .select('*')
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
        id: data.id,
        error: null,
    };
}