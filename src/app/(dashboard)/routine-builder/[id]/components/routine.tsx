"use client"

import Floor from "@/app/(dashboard)/routine-builder/[id]/components/floor";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import { RoutineDetailData } from "@/schemas/routine.schema";
import { useState } from "react";

export interface RoutineProps {
    routine: RoutineDetailData
}

export default function Routine({ routine }: RoutineProps) {
    const [athletes, setAthletes] = useState([
        { id: 'athlete-1', x: 7.0, y: 7.0, color: '#ff0044', number: 1, name: 'Athlet 1' },
    ]);

    const handleAddAthlete = () => {
        const name = prompt("Name des Athleten (optional):") || "";
        const athletesCount = athletes.length;
        const number = athletesCount >= 1
            ? athletes[athletesCount - 1].number + 1
            : 1;

        const newAthlete = {
            id: `athlete-${Date.now()}`,
            x: 7.0,
            y: 7.0,
            color: '#ff0044',
            number: number,
            name: name.trim(),
        };

        setAthletes(prev => [...prev, newAthlete]);
    }

    return (
        <div className="flex flex-col h-full w-full">

            <div className="flex justify-between items-center p-4">
                <span className="font-bold text-lg">{routine.name}</span>

                <Button
                    variant={"outline"}
                    onClick={handleAddAthlete}
                    startIcon={<PlusIcon />}
                >
                    Athlet hinzufügen
                </Button>
            </div>

            <div className="flex-grow w-full relative">
                <Floor
                    athletes={athletes}
                    setAthletes={setAthletes}
                />
            </div>
        </div>
    )
}