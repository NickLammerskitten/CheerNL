import TrainingPlanAthleteCreateForm
    from "@/app/(dashboard)/training-plan/create/components/training-plan-athlete-create-form";
import ComponentCard from "@/components/common/ComponentCard";
import { fetchTrainingPlanList } from "@/services/training-plan.api";

export default async function CreateTrainingPlanAthletePage() {

    const trainingPlans = await fetchTrainingPlanList();

    return (
        <ComponentCard title={"Kraft- und Ausdauertraining > Athlet anlegen"}>
            <TrainingPlanAthleteCreateForm trainingPlans={trainingPlans} />
        </ComponentCard>
    )
}