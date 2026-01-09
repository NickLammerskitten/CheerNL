import {ActivityDashboard} from "@/app/(dashboard)/training-plan/[id]/components/activity-dashboard";
import TrainingPlanAthleteActivities
    from "@/app/(dashboard)/training-plan/[id]/components/training-plan-athlete-activities";
import TrainingPlanAthleteDetails from "@/app/(dashboard)/training-plan/[id]/components/training-plan-athlete-details";
import ComponentCard from "@/components/common/ComponentCard";
import {fetchActivities} from "@/services/training-plan-athlete-activity.api";
import {fetchTrainingPlanAthlete} from "@/services/training-plan-athlete.api";
import {fetchTrainingPlanAthleteFilePermissionList} from "@/services/training-plan-athlete-file-permission.api";

export default async function TrainingPlanAthletePage({
                                                          params,
                                                      }: {
    params: Promise<{ id: string }>
}) {
    const paramValues = await params;

    const [trainingPlanAthlete, permissions, activities] = await Promise.all([
        fetchTrainingPlanAthlete(paramValues.id),
        fetchTrainingPlanAthleteFilePermissionList(paramValues.id),
        fetchActivities(paramValues.id)
    ]);

    return (
        <ComponentCard title={"Kraft und Ausdauertraining > Athlet"}>
            <TrainingPlanAthleteDetails
                trainingPlanAthlete={trainingPlanAthlete}
                folderPermissions={permissions}
            />

            <ActivityDashboard data={activities}/>

            <TrainingPlanAthleteActivities activities={activities}/>
        </ComponentCard>
    )
}