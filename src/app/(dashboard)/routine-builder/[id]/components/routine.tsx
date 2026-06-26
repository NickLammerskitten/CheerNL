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
    const [formations, setFormations] = useState([
        {
            id: 'formation-1',
            name: '1. Aufstellung',
            athletes: [
                { id: 'athlete-1', x: 7.0, y: 7.0, color: '#ff0044', number: 1 },
            ],
        },
    ]);

    const [activeIndex, setActiveIndex] = useState(0);

    const handleAddAthlete = () => {
        const name = prompt("Name des Athleten:") || "";
        const newId = `athlete-${Date.now()}`;
        const athletesCount = formations[0]?.athletes.length;
        const number = athletesCount >= 1
            ? formations[0]?.athletes[athletesCount - 1].number + 1
            : 1;

        const newAthleteBase = { id: newId, color: '#ff0044', name: name, number: number };

        setFormations(prev => prev.map(formation => ({
            ...formation,
            athletes: [...formation.athletes, { ...newAthleteBase, x: 7.0, y: 7.0 }],
        })));
    }

    const handleAddFormation = () => {
        const currentFormation = formations[activeIndex];
        const newFormation = {
            id: `formation-${Date.now()}`,
            name: `${formations.length + 1}. Formation`,
            athletes: currentFormation.athletes.map(a => ({ ...a })),
        };

        setFormations(prev => [...prev, newFormation]);
        setActiveIndex(formations.length);
    }

    const updateActiveFormationAthletes = (newAthletesOrUpdater: any) => {
        setFormations(prev => {
            const newFormations = [...prev];
            const currentAthletes = newFormations[activeIndex].athletes;

            const updatedAthletes = typeof newAthletesOrUpdater === 'function'
                ? newAthletesOrUpdater(currentAthletes)
                : newAthletesOrUpdater;

            newFormations[activeIndex] = {
                ...newFormations[activeIndex],
                athletes: updatedAthletes,
            };
            return newFormations;
        });
    }

    const activeFormation = formations[activeIndex];

    return (
        <div className="flex flex-col h-full w-full bg-gray-50 overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-white border-b">
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
                    athletes={activeFormation.athletes}
                    setAthletes={updateActiveFormationAthletes}
                />
            </div>

            <div className="p-4 bg-white border-t flex gap-3 overflow-x-auto items-center flex-nowrap [overflow-wrap:anywhere]">
                {formations.map((formation, index) => (
                    <div
                        key={formation.id}
                        className="shrink-0"
                    >
                        <Button
                            key={formation.id}
                            onClick={() => setActiveIndex(index)}
                            variant={index === activeIndex ? 'primary' : 'outline'}
                        >
                            {formation.name}
                        </Button>
                    </div>
                ))}

                <div className="shrink-0">
                    <Button
                        startIcon={<PlusIcon />}
                        onClick={handleAddFormation}
                        variant={'outline'}
                    >
                        Formation
                    </Button>
                </div>
            </div>
        </div>
    )
}