import RoutineAthleteList from "@/app/(dashboard)/routine-builder/[id]/athletes/components/athlete-list";
import ComponentCard from "@/components/common/ComponentCard";
import { fetchAthleteList } from "@/services/routine.api";

export default async function RoutineBuilderAthletesPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const paramValues = await params;

    const athletes = await fetchAthleteList(paramValues.id)

    return (
        <ComponentCard title={"Athleten"}>
            <RoutineAthleteList routineId={paramValues.id} athletes={athletes} />
        </ComponentCard>
    )
}