import ComponentCard from "@/components/common/ComponentCard";
import EventEditForm from "@/app/(dashboard)/events/[id]/edit/components/event-edit-form";
import { fetchEvent } from "@/services/event.api";

export default async function EditEventPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const paramValues = await params;

    const event = await fetchEvent(paramValues.id);

    return (
        <ComponentCard title={event.title}>
            <EventEditForm event={event} />
        </ComponentCard>
    )
}