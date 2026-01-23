"use server"

import { EventSlotOccurrence } from "@/schemas/event-slot-occurence.schema";
import { EventSlotDetailData, EventSlotDetailDataSchemaList } from "@/schemas/event-slot.schema";
import { EventListData, EventListDataSchema } from "@/schemas/event.schema";
import { mapSlotsToOccurrences, SlotWithEvent } from "@/services/event-slot-occurence/occurrence-mapper";
import { createClient } from "@/utils/supabase/server";

export type EventSlotOccurrenceResponse = {
    data: EventSlotOccurrence[];
    totalCount: number;
}

export async function fetchEventSlotOccurrences(
    from: Date,
    to: Date,
    filterCoachIds?: string[],
): Promise<EventSlotOccurrenceResponse> {
    const supabase = await createClient();

    const fromFilter = from.toISOString();
    const toFilter = to.toISOString();

    const onceCondition = `and(recurrence_type.eq.ONCE,slot_start.gte.${fromFilter},slot_start.lte.${toFilter})`;
    const weeklyCondition = `and(recurrence_type.eq.WEEKLY,slot_start.lte.${toFilter},slot_end.gte.${fromFilter})`;

    const coachRelation = (filterCoachIds && filterCoachIds.length > 0)
        ? "event_slot_coach!inner(*, coach(name))"
        : "event_slot_coach(*, coach(name))";

    let query = supabase
        .from("event_slot")
        .select(`
            *,
            ${coachRelation},
            event_registration(*, team(name))
        `, { count: 'exact' })
        .or(`${onceCondition},${weeklyCondition}`);

    if (filterCoachIds && filterCoachIds.length > 0) {
        const { data: coachSlots, error: coachSlotError } = await supabase
            .from("event_slot_coach")
            .select("slot_id")
            .in("coach_id", filterCoachIds);

        if (coachSlotError || !coachSlots || coachSlots.length === 0) {
            return emptyResponse();
        }

        const slotIds = coachSlots.map(cs => cs.slot_id);
        query = query.in("id", slotIds);
    }

    const { data: slotsRawData, count, error: eventSlotError } = await query;

    if (eventSlotError) {
        return emptyResponse();
    }

    const slotData = EventSlotDetailDataSchemaList.parse(slotsRawData);

    const eventIds = slotData.map(slot => slot.eventId);

    const { data: eventsRawData, error: eventsError } = await supabase
        .from('event')
        .select('*')
        .filter('id', 'in', '(' + eventIds + ')');

    if (eventsError) {
        return emptyResponse();
    }

    const eventData = EventListDataSchema.parse(eventsRawData);
    const slotsWithEvents = matchEventToSlot(eventData, slotData);

    const occurrences = mapSlotsToOccurrences(slotsWithEvents, from, to);

    return {
        data: occurrences,
        totalCount: count,
    } as EventSlotOccurrenceResponse;
}

function emptyResponse() {
    return {
        data: [],
        totalCount: 0,
    } as EventSlotOccurrenceResponse;
}

function matchEventToSlot(events: EventListData[], slots: EventSlotDetailData[]): SlotWithEvent[] {
    return slots.map((slot) => {
        const parentEvent = events.find((e) => e.id === slot.eventId);
        return parentEvent ? { slot, event: parentEvent } : null;
    }).filter((item): item is { slot: EventSlotDetailData; event: EventListData } => item !== null);
}