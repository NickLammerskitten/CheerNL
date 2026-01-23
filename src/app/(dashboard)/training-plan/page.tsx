import WeightliftingActionButtons from "@/app/(dashboard)/training-plan/components/action-buttons";
import TrainingPlanAthletesTable from "@/app/(dashboard)/training-plan/components/training-plan-athletes-table";
import ComponentCard from "@/components/common/ComponentCard";
import { fetchTrainingPlanAthleteList } from "@/services/training-plan-athlete.api";
import ServersideSearch from "@/components/tables/ServersideSearch";
import React from "react";

export default async function TrainingPlanPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string }>;
}) {
    const searchParamValues = await searchParams;
    const currentPage = Number(searchParamValues.page) || 1;
    const searchQuery = searchParamValues.search || undefined;

    const { data, totalPages } = await fetchTrainingPlanAthleteList(currentPage, searchQuery);

    return (
        <ComponentCard title={"Kraft- und Ausdauertraining > Athleten"}>
            <div className={"flex flex-col mb-1 gap-1 sm:flex-row sm:justify-between"}>
                <ServersideSearch />
                <WeightliftingActionButtons />
            </div>

            <TrainingPlanAthletesTable
                athletes={data}
                totalPages={totalPages}
            />
        </ComponentCard>
    )
}