import WeightliftingActionButtons from "@/app/(dashboard)/training-plan/components/action-buttons";
import TrainingPlanAthletesTable from "@/app/(dashboard)/training-plan/components/training-plan-athletes-table";
import ComponentCard from "@/components/common/ComponentCard";
import { fetchTrainingPlanAthleteList } from "@/services/training-plan-athlete.api";

export default async function TrainingPlanPage() {
    const weightlifters = await fetchTrainingPlanAthleteList();

    return (
        <ComponentCard title={"Kraft- und Ausdauertraining > Athleten"}>
            <WeightliftingActionButtons />

            <TrainingPlanAthletesTable athletes={weightlifters} />
        </ComponentCard>
    )
}