import Routine from "@/app/(dashboard)/routine-builder/[id]/components/routine";
import { fetchRoutine } from "@/services/routine.api";

export default async function RoutineBuilderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const paramValues = await params;

    const routine = await fetchRoutine(paramValues.id);

    return (
        <Routine routine={routine} />
    )
}