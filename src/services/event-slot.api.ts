"use server"

import { EventSlotCreateData, EventSlotCreateSchema, EventSlotListItemDataSchema } from "@/schemas/event-slot.schema";
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

    const supabase = await createClient();
    const { data, status, statusText } = await supabase
        .from('event_slot')
        .upsert(newData)
        .select('*')
        .single()

    if (status !== 200 && status !== 201) {
        return {
            success: false,
            id: null,
            error: `Es ist ein Fehler aufgetreten: ${status} - ${statusText}`,
        }
    }

    const savedData = EventSlotListItemDataSchema.parse(data);

    return {
        success: true,
        id: savedData.id,
        error: null,
    }
}