"use server";

import {
    createEventSlotRegistrationSchema,
    EventRegistrationPublicData,
} from "@/schemas/event-slot-registration-public.schema";
import { UpsertResponseSchema } from "@/schemas/upsert-response.schema";
import { fetchEventPublic } from "@/services/event-public.api";
import { createClient } from "@/utils/supabase/server";

export async function fetchEventRegistrationCount(eventSlotId: string): Promise<number> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .rpc('get_event_registration_count', { event_id_input: eventSlotId })

    if (error) {
        return 0;
    }

    return data as number;
}

export async function saveEventRegistration(newData: EventRegistrationPublicData): Promise<UpsertResponseSchema> {
    const event = await fetchEventPublic(newData.event_id);
    const eventSlot = event.slots.find(s => s.id === newData.event_slot_id);
    if (!eventSlot) {
        return {
            success: false,
            id: null,
            error: "Das Event konnte nicht gefunden werden",
        }
    }

    if (!createEventSlotRegistrationSchema(event.type).safeParse(newData).success) {
        return {
            success: false,
            id: null,
            error: 'Die Daten konnten nicht validiert werden',
        };
    }

    const maxRegistrationsExceeded = await checkMaxRegistrationsExceeded(eventSlot.id, eventSlot.maxRegistrations)
    if (maxRegistrationsExceeded) {
        return {
            success: false,
            id: null,
            error: "Das ausgewählt Element ist bereits ausgebucht",
        }
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

async function checkMaxRegistrationsExceeded(eventSlotId: string, maxRegistrations: number | null) {
    if (!maxRegistrations) {
        return false;
    }

    const registrationCount = await fetchEventRegistrationCount(eventSlotId);

    return registrationCount >= maxRegistrations;
}