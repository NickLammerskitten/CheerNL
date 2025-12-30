import TrainingPlansActionButtons from "@/app/(dashboard)/training-plan/plans/components/action-buttons";
import TrainingPlansTable from "@/app/(dashboard)/training-plan/plans/components/training-plans-table";
import ComponentCard from "@/components/common/ComponentCard";
import { fetchTrainingPlanList } from "@/services/training-plan.api";

export default async function TrainingPlans() {
    const plans = await fetchTrainingPlanList();

    return (
        <ComponentCard title={"Kraft- und Ausdauertraining > Trainingspläne"}>
            <TrainingPlansActionButtons />

            <TrainingPlansTable trainingPlans={plans} />
        </ComponentCard>
    )
}