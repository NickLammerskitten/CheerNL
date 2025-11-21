import ComponentCard from "@/components/common/ComponentCard";
import EventCreateForm from "@/components/events/event-create-form";
import React from "react";

export default async function CreateEventPage() {

    return (
        <>
            <ComponentCard title={"Event erstellen"}>
                <EventCreateForm />
            </ComponentCard>
        </>
    )
}