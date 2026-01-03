import { ActivityDashboard } from "@/app/(dashboard)/training-plan/[id]/components/activity-dashboard";
import TrainingPlanAthleteActivities
    from "@/app/(dashboard)/training-plan/[id]/components/training-plan-athlete-activities";
import TrainingPlanAthleteDetails from "@/app/(dashboard)/training-plan/[id]/components/training-plan-athlete-details";
import ComponentCard from "@/components/common/ComponentCard";
import { FilePermission, getFilePermissions } from "@/services/google-drive/google-drive-files.api";
import { fetchActivities } from "@/services/training-plan-athlete-activity.api";
import { fetchTrainingPlanAthlete } from "@/services/training-plan-athlete.api";

export default async function TrainingPlanAthletePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const paramValues = await params;

    const trainingPlanAthlete = await fetchTrainingPlanAthlete(paramValues.id);

    let permissions: FilePermission[] | undefined = undefined;
    if (trainingPlanAthlete.googleDriveFolderId) {
        permissions = await getFilePermissions(trainingPlanAthlete.googleDriveFolderId)
    }

    const activities = await fetchActivities(trainingPlanAthlete.id);

    return (
        <ComponentCard title={"Kraft und Ausdauertraining > Athlet"}>
            <TrainingPlanAthleteDetails
                trainingPlanAthlete={trainingPlanAthlete}
                folderPermissions={permissions}
            />

            <ActivityDashboard data={activities} />

            <TrainingPlanAthleteActivities activities={activities} />
        </ComponentCard>
    )
}