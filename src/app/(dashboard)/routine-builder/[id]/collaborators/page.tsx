import RoutineCollaboratorsList
    from "@/app/(dashboard)/routine-builder/[id]/collaborators/components/collaborators-list";
import ComponentCard from "@/components/common/ComponentCard";
import { fetchCoachList } from "@/services/coach.api";
import { fetchRoutine, fetchRoutineCollaborators } from "@/services/routine.api";

export default async function RoutineCollaboratorsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const paramValues = await params;

    const routine = await fetchRoutine(paramValues.id);

    if (!routine.isOwner) {
        return (
            <ComponentCard title={"Rechte verwalten"}>
                <span>Du bist nicht berechtigt, da du nicht der Owner der Routine</span>
            </ComponentCard>
        )
    }

    const collaborators = await fetchRoutineCollaborators(paramValues.id);
    const coaches = await fetchCoachList();

    return (
        <ComponentCard title={"Rechte verwalten"}>
            <RoutineCollaboratorsList
                routineId={routine.id}
                ownerId={routine.ownerId}
                collaborators={collaborators}
                coaches={coaches}
            />
        </ComponentCard>
    )
}