import ComponentCard from "@/components/common/ComponentCard";
import EditEventButton from "@/components/events/edit-event-button";
import EventDetails from "@/components/events/event-details";
import EventSlotsTable from "@/components/events/slots/event-slots-table";
import CreateSlotModal from "@/components/events/slots/slot-create-modal";
import { EventType } from "@/schemas/event.schema";
import { fetchEvent } from "@/services/event.api";
import React from "react";

export default async function EventDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const paramValues = await params;

    const event = await fetchEvent(paramValues.id);

    return (
        <>
            <EditEventButton
                eventId={event.id}
                minimal={false}
            />

            <ComponentCard
                title={`Details zu ${event.title}`}
                className={"mt-3"}
            >
                <EventDetails event={event} />
            </ComponentCard>

            <ComponentCard
                title={event.type === EventType.TUMBLINGClASS ? 'Classes' : 'Optionen'}
                className={"mt-3"}
            >
                <CreateSlotModal eventId={event.id} />

                <EventSlotsTable slots={event.slots} />
            </ComponentCard>
        </>
    )
}

