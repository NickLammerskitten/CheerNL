"use client"

import Floor from "@/app/(dashboard)/routine-builder/[id]/components/floor";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import { FormationClientCreateData, FormationClientCreateSchema, FormationItemData } from "@/schemas/formation.schema";
import { RoutineAthleteCreateData, RoutineAthleteCreateSchema } from "@/schemas/routine-athlete.schema";
import { RoutineDetailData } from "@/schemas/routine.schema";
import { addAthlete, addFormation, updateAthletePosition } from "@/services/routine.api";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface RoutineProps {
    routine: RoutineDetailData
    formations: FormationItemData[];
}

export default function Routine({ routine, formations: initialFormations }: RoutineProps) {
    const router = useRouter();

    const [formations, setFormations] = useState<FormationItemData[]>(initialFormations);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        setFormations(initialFormations);
    }, [initialFormations]);

    useEffect(() => {
        const supabase = createClient();

        const channel = supabase.channel(`routine_${routine.id}`)

            // EVENT: Position eines Athleten wurde aktualisiert (Drag & Drop)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'routine_formation_position',
                },
                (payload) => {
                    const newPos = payload.new;

                    setFormations((prevFormations) =>
                        prevFormations.map((formation) => {
                            if (formation.id != newPos.routine_formation_id) {
                                return formation;
                            }

                            return {
                                ...formation,
                                athletePositions: formation.athletePositions.map((pos) =>
                                    pos.id === newPos.id
                                        ? { ...pos, posX: newPos.pos_x, posY: newPos.pos_y }
                                        : pos,
                                ),
                            };
                        }),
                    );
                },
            )

            // EVENT: Neue Formation erstellt
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'routine_formation',
                    filter: `routine_id=eq.${routine.id}`,
                },
                () => {
                    router.refresh()
                },
            )

            // EVENT: Neuer Athlet erstellt
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'routine_athlete',
                    filter: `routine_id=eq.${routine.id}`,
                },
                () => {
                    router.refresh();
                },
            )

            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [routine.id]);

    const handleAddAthlete = async () => {
        const rawData = {
            routine_id: routine.id,
            name: null,
        } as RoutineAthleteCreateData;

        const saveData = RoutineAthleteCreateSchema.safeParse(rawData);

        if (!saveData.success) {
            console.error(saveData.error)
            return;
        }

        const result = await addAthlete(saveData.data);
        if (!result) {
            console.error('An error occurred while saving formation');
            return;
        }
    }

    const handleAddFormation = async () => {
        const rawData = {
            routine_id: routine.id,
            name: null,
        } as FormationClientCreateData;

        const saveData = FormationClientCreateSchema.safeParse(rawData);

        if (!saveData.success) {
            console.log(saveData);
            return;
        }

        const result = await addFormation(saveData.data);
        if (!result) {
            console.error('An error occurred while saving formation');
            return;
        }
    };

    const activeFormation = formations.length > 0 ? formations[activeIndex] : undefined;

    const handleFormationPositionMove = async (formation_position_id: string, newX: number, newY: number) => {
        await updateAthletePosition(
            formation_position_id,
            {
                pos_x: newX,
                pos_y: newY,
            },
        );
    };

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
                {activeFormation
                    ? <Floor
                        formationPositions={activeFormation.athletePositions}
                        onFormationPositionMove={handleFormationPositionMove}
                    />
                    : <span>
                        Erstelle eine Formation.
                    </span>
                }
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
                            {formation.name ?? `Formation ${formation.sortIndex + 1}`}
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