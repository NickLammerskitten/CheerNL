"use server"

import {
    EventDetailPublicDataSchema,
    EventPublicDetailData,
    EventPublicListData,
    EventPublicListDataSchema,
} from "@/schemas/event-public.schema";
import { EventType } from "@/types/event-type";
import { createClient } from "@/utils/supabase/server";

interface EventFilterProps {
    page: number;
    pageSize: number;
    registrationOpen: boolean;
    type?: EventType;
}

export type PaginatedEventPublicListResponse = {
    data: EventPublicListData[];
    totalCount: number;
}

export async function fetchEventPublic(id: string): Promise<EventPublicDetailData> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('event')
        .select('*, event_slot(*, event_slot_coach(*, coach(name)))')
        .eq('id', id)
        .single()

    if (error) {
        throw new Error(`Supabase-Fehler: ${error.message}`);
    }

    try {
        return EventDetailPublicDataSchema.parse(data);
    } catch (validationError) {
        console.error("Zod Validierungsfehler:", validationError);
        throw new Error("Ungültige Daten von der API empfangen.");
    }
}

export async function fetchEventsPublic({
    page,
    pageSize,
    registrationOpen,
    type,
}: EventFilterProps): Promise<PaginatedEventPublicListResponse> {
    const supabase = await createClient();

    const from = (page - 1) * pageSize;
    const to = page * pageSize - 1;

    let query = supabase
        .from('event')
        .select('*', { count: "exact" });

    if (type) {
        query = query.eq('type', type);
    }

    if (registrationOpen) {
        query = query.gt('registration_till', new Date().toISOString());
    } else {
        query = query.lte('registration_till', new Date().toISOString());
    }

    const { data, count } = await query
        .order('registration_till', { ascending: true })
        .range(from, to);

    const parsedData = EventPublicListDataSchema.safeParse(data)

    if (parsedData.error) {
        return {
            data: [],
            totalCount: 0,
        };
    }

    return {
        data: parsedData.data ?? [],
        totalCount: count ?? 0,
    }
}
