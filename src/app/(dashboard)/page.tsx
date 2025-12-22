import CalendarWrapper from "@/app/(dashboard)/components/calendar-wrapper";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import React from "react";

export default async function Dashboard() {

    return (
        <>
            <PageBreadCrumb pageTitle={"Dashboard"}/>
            <CalendarWrapper />
        </>
    );
}
