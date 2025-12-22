"use server";

import {
    EventSlotRegistrationPublicCreateSchema,
    EventRegistrationPublicData,
} from "@/schemas/event-slot-registration-public.schema";
import { UpsertResponseSchema } from "@/schemas/upsert-response.schema";
import { createClient } from "@/utils/supabase/server";

export async function saveEventRegistration(newData: EventRegistrationPublicData): Promise<UpsertResponseSchema> {
    if (!EventSlotRegistrationPublicCreateSchema.safeParse(newData).success) {
        return {
            success: false,
            id: null,
            error: 'Die Daten konnten nicht validiert werden',
        };
    }

    const supabase = await createClient();
    const { status, statusText } = await supabase
        .from('event_registration')
        .upsert(newData);

    if (status !== 200 && status !== 201) {
        return {
            success: false,
            id: null,
            error: `Es ist ein Fehler aufgetreten: ${status} - ${statusText}`,
        }
    }

    return {
        success: true,
        id: null,
        error: null,
    };
}