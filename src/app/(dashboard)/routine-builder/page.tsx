import RoutinesTable from "@/app/(dashboard)/routine-builder/components/routines-table";
import ComponentCard from "@/components/common/ComponentCard";
import { fetchRoutineList } from "@/services/routine.api";

export default async function routineBuilderPage() {
    // TODO: Create Routine
    // TODO: Edit page

    const routines = await fetchRoutineList();

    return (
        <ComponentCard title={"Routine Builder"}>
            <RoutinesTable routines={routines}></RoutinesTable>
        </ComponentCard>
    )
}