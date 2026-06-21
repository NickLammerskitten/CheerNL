import RoutinesTable from "@/app/(dashboard)/routine-builder/components/routines-table";
import ComponentCard from "@/components/common/ComponentCard";

export default async function routineBuilderPage() {
    // TODO: Fetch routines
    // TODO: Create Routine
    // TODO: Edit page

    return (
        <ComponentCard title={"Routine Builder"}>
            <RoutinesTable routines={[]}></RoutinesTable>
        </ComponentCard>
    )
}