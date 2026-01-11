import ComponentCard from "@/components/common/ComponentCard";
import { fetchCoachList } from "@/services/coach.api";
import React from "react";
import CoachesTable from "@/app/(dashboard)/(others-pages)/coaches/components/coaches-table";

export default async function Coaches() {
    const coaches = await fetchCoachList()

    return (
        <ComponentCard title={"Coaches"}>
            <CoachesTable coaches={coaches} />
        </ComponentCard>
    )
}