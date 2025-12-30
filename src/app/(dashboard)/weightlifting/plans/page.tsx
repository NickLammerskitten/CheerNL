import PlansActionButtons from "@/app/(dashboard)/weightlifting/plans/components/action-buttons";
import TrainingPlansTable from "@/app/(dashboard)/weightlifting/plans/components/training-plans-table";
import ComponentCard from "@/components/common/ComponentCard";
import { fetchTrainingPlanList } from "@/services/training-plan.api";

export default async function WeightliftingPlans() {
    const plans = await fetchTrainingPlanList();

    return (
        <ComponentCard title={"Kraft- und Ausdauertraining > Trainingspläne"}>
            <PlansActionButtons />

            <TrainingPlansTable trainingPlans={plans} />
        </ComponentCard>
    )
}