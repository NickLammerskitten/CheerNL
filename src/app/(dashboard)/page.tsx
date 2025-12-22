import CalendarWrapper from "@/app/(dashboard)/components/calendar-wrapper";
import ComponentCard from "@/components/common/ComponentCard";
import React from "react";

export default async function Dashboard() {

    return (
        <ComponentCard title={"Dashboard"}>
            <CalendarWrapper />
        </ComponentCard>
    );
}
