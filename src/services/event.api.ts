'use server'

import {
    EventDetailData,
    EventDetailDataSchema,
    EventListData,
    EventListDataSchema,
    EventUpdateData,
    EventUpdateSchema,
} from "@/schemas/event.schema";
import { createClient } from "@/utils/supabase/server";

export type PaginatedEventListResponse = {
    data: EventListData[];
    totalCount: number;
}

export async function fetchEventList(page: number, pageSize: number): Promise<PaginatedEventListResponse> {
    const supabase = await createClient();

    const from = (page - 1) * pageSize;
    const to = page * pageSize - 1;

    const { data: rawData, error, count } = await supabase
        .from('event')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Supabase-Fehler: ${error.message}`);
    }

    try {
        const parsedData = EventListDataSchema.parse(rawData);

        return {
            data: parsedData,
            totalCount: count ?? 0,
        };
    } catch (validationError) {
        console.error("Zod Validierungsfehler:", validationError);
        throw new Error("Ungültige Daten von der API empfangen.");
    }
}

export async function fetchEvent(id: string): Promise<EventDetailData> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('event')
        .select('*, event_slot(*)')
        .eq('id', id)
        .single()

    if (error) {
        throw new Error(`Supabase-Fehler: ${error.message}`);
    }

    try {
        return EventDetailDataSchema.parse(data);
    } catch (validationError) {
        console.error("Zod Validierungsfehler:", validationError);
        throw new Error("Ungültige Daten von der API empfangen.");
    }
}

export async function saveEvent(updateData: EventUpdateData): Promise<string | null> {
    const safeData = EventUpdateSchema.safeParse(updateData);
    if (!safeData.success) {
        return 'Die Daten konnten nicht validiert werden';
    }

    const supabase = await createClient();
    const { status, statusText } = await supabase
        .from('event')
        .update(safeData.data)
        .eq('id', safeData.data.id)

    if (status !== 204) {
        return `Beim Bearbeiten ist ein Fehler aufgetreten: ${status} - ${statusText}`;
    }

    return null;
}

export async function deleteEvent(id: string) {
    const supabase = await createClient();
    const { status, statusText } = await supabase
        .from('event')
        .delete()
        .eq('id', id);

    if (status !== 204) {
        throw new Error(`Beim Löschen ist ein Fehler aufgetreten: ${status} - ${statusText}`)
    }
}