import ComponentCard from "@/components/common/ComponentCard";
import { fetchTeamCount } from "@/services/team.api";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title:
        "CLE - Dashboard",
    description: "CLE Vereinsverwaltung - Dashboard",
};

export default async function Dashboard() {

    const teams = await fetchTeamCount()

    return (
        <ComponentCard title={"Dashboard"}>
            <span className={"dark:text-white/90"}>
                Teams im Verein: {teams}
            </span>
        </ComponentCard>

    );
}
