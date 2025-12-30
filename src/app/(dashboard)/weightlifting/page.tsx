import WeightliftingActionButtons from "@/app/(dashboard)/weightlifting/components/action-buttons";
import ComponentCard from "@/components/common/ComponentCard";

export default async function WeightliftingPage() {

    return (
        <ComponentCard title={"Kraft- und Ausdauertraining"}>
            <WeightliftingActionButtons />
        </ComponentCard>
    )
}