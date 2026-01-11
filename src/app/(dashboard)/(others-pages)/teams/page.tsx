import ComponentCard from "@/components/common/ComponentCard";
import { fetchTeamList } from "@/services/team.api";
import React from "react";
import TeamsTable from "@/app/(dashboard)/(others-pages)/teams/compontens/teams-table";

export default async function Teams() {
    const teams = await fetchTeamList()

    return (
        <ComponentCard title={"Teams"}>
            <TeamsTable teams={teams} />
        </ComponentCard>
    )
}