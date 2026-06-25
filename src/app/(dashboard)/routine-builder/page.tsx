import RoutinesTable from "@/app/(dashboard)/routine-builder/components/routines-table";
import ComponentCard from "@/components/common/ComponentCard";
import { fetchRoutineList } from "@/services/routine.api";
import { fetchTeamList } from "@/services/team.api";

export default async function routineBuilderPage() {
    const routines = await fetchRoutineList();
    const teams = await fetchTeamList();

    return (
        <ComponentCard title={"Routine Builder"}>
            <RoutinesTable
                routines={routines}
                teams={teams}
            ></RoutinesTable>
        </ComponentCard>
    )
}