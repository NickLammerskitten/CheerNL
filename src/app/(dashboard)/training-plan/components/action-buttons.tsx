"use client"

import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import { useRouter } from "next/navigation";
import React from "react";

export default function WeightliftingActionButtons() {

    const router = useRouter();

    return (
        <div className={"flex flex-row gap-1"}>
            <Button
                startIcon={<PlusIcon />}
                variant={"outline"}
                onClick={() => router.push("/training-plan/create")}
            >
                Athlet anlegen
            </Button>

            <Button
                variant={"outline"}
                onClick={() => router.push("weightlifting/plans")}
            >
                Trainingspläne
            </Button>
        </div>
    )
}
