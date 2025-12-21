import ComponentCard from "@/components/common/ComponentCard";
import EventCreateForm from "@/app/(dashboard)/events/create/components/event-create-form";
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