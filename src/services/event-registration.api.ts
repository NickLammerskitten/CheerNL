"use server"

import { createClient } from "@/utils/supabase/server";
import { EventRegistrationData, EventSlotRegistrationListItemDataSchema } from "@/schemas/event-slot-registration.schema";
import { UpsertResponseSchema } from "@/schemas/upsert-response.schema";
import { fetchEvent } from "@/services/event.api";
import { checkMaxRegistrationsExceeded } from "@/utils/check-max-registrations-exceeded";

async function fetchEventRegistrationCount(eventSlotId: string): Promise<number> {
    const supabase = await createClient();
    const {data, error} = await supabase
        .rpc('get_event_registration_count', {event_id_input: eventSlotId, with_waitlist: false})

    if (error) {
        return 0;
    }

    return data as number;
}

export async function deleteEventRegistration(id: string) {
    const supabase = await createClient();
    const { status, statusText } = await supabase
        .from('event_registration')
        .delete()
        .eq('id', id);

    if (status !== 204) {
        throw new Error(`Beim Löschen ist ein Fehler aufgetreten: ${status} - ${statusText}`)
    }
}


export async function moveRegistrationFromWaitlist(id: string): Promise<UpsertResponseSchema> {
    const registration = await fetchEventRegistration(id);
    const event = await fetchEvent(registration.eventId);
    const slot = event.slots.find(s => s.id === registration.eventSlotId);

    if (!slot) {
        return {
            success: false,
            error: 'Das Event ist invalide.',
            id: null
        }
    }

    const registrationCount = await fetchEventRegistrationCount(slot.id)
    const maxRegistrationsExceeded = checkMaxRegistrationsExceeded(slot.maxRegistrations, registrationCount)
    if (maxRegistrationsExceeded) {
        return {
            success: false,
            error: `Die maximale Anzahl an Registrierungen von ${slot.maxRegistrations} Person(en) wurde bereits erreicht.`,
            id: null
        }
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from('event_registration')
        .update({
            id: id,
            waitlist: false
        })
        .eq('id', id);

    if (error) {
        return {
            success: false,
            error: `Die Aktualisierung der Daten hat nicht geklappt. ${error}`,
            id: null
        }
    }

    return {
        success: true,
        error: null,
        id: id
    }
}


async function fetchEventRegistration(id: string): Promise<EventRegistrationData> {
    const supabase = await createClient();
    const { data: rawData, error } = await supabase
        .from('event_registration')
        .select('*, team(name)')
        .eq('id', id)
        .single();

    if (error) {
        throw new Error(`Supabase-Fehler: ${error.message}`);
    }

    try {
        return EventSlotRegistrationListItemDataSchema.parse(rawData);
    } catch (validationError) {
        console.error("Zod Validierungsfehler:", validationError);
        throw new Error("Ungültige Daten von der API empfangen.");
    }
}