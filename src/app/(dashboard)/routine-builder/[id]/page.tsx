import { fetchRoutine } from "@/services/routine.api";

export default async function RoutineBuilderDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const paramValues = await params;

    const routine = await fetchRoutine(paramValues.id);

    return (
        <>
            {routine.name}
        </>
    )
}