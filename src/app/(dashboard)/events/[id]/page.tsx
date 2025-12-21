import EventActionButtons from "@/app/(dashboard)/events/[id]/components/event-action-buttons";
import EventDetails from "@/app/(dashboard)/events/[id]/components/event-details";
import EventSlotsTable from "@/app/(dashboard)/events/[id]/components/event-slots-table";
import CreateSlotModal from "@/app/(dashboard)/events/[id]/components/slot-create-modal";
import ComponentCard from "@/components/common/ComponentCard";
import { fetchCoachList } from "@/services/coach.api";
import { fetchEvent } from "@/services/event.api";
import { EventType } from "@/types/event-type";
import React from "react";

export default async function EventDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const paramValues = await params;

    const event = await fetchEvent(paramValues.id);

    const coaches = await fetchCoachList();

    return (
        <>
            <EventActionButtons
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
                <CreateSlotModal
                    eventId={event.id}
                    coaches={coaches}
                />

                <EventSlotsTable slots={event.slots} />
            </ComponentCard>
        </>
    )
}

