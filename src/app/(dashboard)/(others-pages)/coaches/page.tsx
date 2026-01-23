import ComponentCard from "@/components/common/ComponentCard";
import {fetchCoachList} from "@/services/coach.api";
import React from "react";
import CoachesTable from "@/app/(dashboard)/(others-pages)/coaches/components/coaches-table";
import {fetchTeamList} from "@/services/team.api";

export default async function Coaches() {
    const coaches = await fetchCoachList();
    const teams = await fetchTeamList();

    return (
        <ComponentCard title={"Coaches"}>
            <CoachesTable coaches={coaches} teams={teams}/>
        </ComponentCard>
    )
}