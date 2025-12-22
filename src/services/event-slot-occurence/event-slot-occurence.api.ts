"use server"

import { EventSlotOccurrence } from "@/schemas/event-slot-occurence.schema";
import { EventSlotDetailDataSchemaList } from "@/schemas/event-slot.schema";
import { EventListDataSchema } from "@/schemas/event.schema";
import { mapSlotsToOccurrences } from "@/services/event-slot-occurence/occurence-mapper";
import { createClient } from "@/utils/supabase/server";

export type PaginatedEventSlotOccurenceListResponse = {
    data: EventSlotOccurrence[];
    totalCount: number;
}

export async function fetchEventSlotOccurences(from: Date, to: Date): Promise<PaginatedEventSlotOccurenceListResponse> {
    const supabase = await createClient();

    const fromFilter = from.toISOString();
    const toFilter = to.toISOString();

    console.log("fetchEventSlotOccurences", from, to, fromFilter, toFilter);

    const onceCondition = `and(recurrence_type.eq.ONCE,slot_start.gte.${fromFilter},slot_start.lte.${toFilter})`;
    const weeklyCondition = `and(recurrence_type.eq.WEEKLY,slot_start.lte.${toFilter},slot_end.gte.${fromFilter})`;

    const { data: slotsRawData, count } = await supabase
        .from("event_slot")
        .select(`
            *,
            event_slot_coach(*, coach(name)),
            event_registration(*, team(name))
        `, { count: 'exact' })
        .or(`${onceCondition},${weeklyCondition}`);

    const slotData = EventSlotDetailDataSchemaList.parse(slotsRawData);

    const eventIds = slotData.map(slot => slot.eventId);

    const { data: eventsRawData, error: eventsError } = await supabase
        .from('event')
        .select('*')
        .filter('id', 'in', '(' + eventIds + ')');

    console.log("eventsRawData", eventsRawData, eventsError);

    if (eventsError) {
    }
    const eventData = EventListDataSchema.parse(eventsRawData);

    const occurrences = mapSlotsToOccurrences(eventData, slotData, from, to);

    return {
        data: occurrences,
        totalCount: count,
    } as PaginatedEventSlotOccurenceListResponse;
}