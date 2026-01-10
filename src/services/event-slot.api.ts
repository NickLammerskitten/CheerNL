"use server"

import { EventSlotCreateData, EventSlotCreateSchema } from "@/schemas/event-slot.schema";
import { UpsertResponseSchema } from "@/schemas/upsert-response.schema";
import { createClient } from "@/utils/supabase/server";

export async function saveEventSlot(newData: EventSlotCreateData): Promise<UpsertResponseSchema> {
    const dataValid = EventSlotCreateSchema.safeParse(newData);
    if (!dataValid) {
        return {
            success: false,
            id: null,
            error: 'Die Daten konnten nicht validiert werden',
        };
    }

    const { coach_ids, ...slotData } = newData;

    const supabase = await createClient();
    const { data, status, statusText } = await supabase
        .from('event_slot')
        .upsert(slotData)
        .select('id')
        .single()

    if (status !== 200 && status !== 201) {
        return {
            success: false,
            id: null,
            error: `Es ist ein Fehler aufgetreten: ${status} - ${statusText}`,
        }
    }

    if (data && coach_ids) {
        await createEventSlotCoaches(data.id, coach_ids)
    }

    return {
        success: true,
        id: data?.id,
        error: null,
    }
}

async function createEventSlotCoaches(eventSlotId: string, coaches: string[]) {
    const newData = coaches.map((coachId) => ({
        coach_id: coachId,
        slot_id: eventSlotId,
    }))

    const supabase = await createClient();
    const { status, statusText } = await supabase
        .from('event_slot_coach')
        .upsert(newData)

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
    }
}
