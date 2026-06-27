import Routine from "@/app/(dashboard)/routine-builder/[id]/components/routine";
import { fetchRoutine, fetchRoutineFormations } from "@/services/routine.api";

export default async function RoutineBuilderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const paramValues = await params;

    const routine = await fetchRoutine(paramValues.id);
    const formations = await fetchRoutineFormations(paramValues.id);

    return (
        <Routine routine={routine} formations={formations} />
    )
}