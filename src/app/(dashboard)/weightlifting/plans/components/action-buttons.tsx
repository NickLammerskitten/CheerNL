"use client"

import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";

export default function WeightliftingActionButtons() {

    const router = useRouter();

    return (
        <div>
            <Button
                variant={"outline"}
                onClick={() => router.push("/weightlifting")}
            >
                Zurück
            </Button>
        </div>
    )
}
