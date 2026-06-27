"use client"

import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { PlusIcon, TrashBinIcon } from "@/icons";
import { CoachListData } from "@/schemas/coach.schema";
import { RoutineCollaboratorCreateSchema, RoutineCollaboratorItemData } from "@/schemas/routine-collaborator.schema";
import { addRoutineCollaborator, removeRoutineCollaborator } from "@/services/routine.api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface RoutineCollaboratorsListProps {
    ownerId: string;
    routineId: string;
    coaches: CoachListData[];
    collaborators: RoutineCollaboratorItemData[];
}

export default function RoutineCollaboratorsList({
    ownerId,
    routineId,
    collaborators,
    coaches,
}: RoutineCollaboratorsListProps) {
    const router = useRouter();

    const [selectedCoach, setSelectedCoach] = useState<string | undefined>(undefined);
    const [coachOptions, setCoachOptions] = useState<{ value: string, label: string }[]>([]);

    useEffect(() => {
        const options = parseCoachesToOptions();
        setCoachOptions(options);
    }, [coaches]);

    const parseCoachesToOptions = () => {
        return coaches?.map(coach => {
            return {
                value: coach.userId,
                label: coach.name,
            }
        }).filter((coach) => {
            return coach.value !== ownerId
                || collaborators.find((collaborator) => collaborator.userId !== coach.value);
        }) ?? [];
    }

    const goBack = () => {
        router.back();
    }

    const handleAddCollaborator = async () => {
        const rawData = {
            routine_id: routineId,
            user_id: selectedCoach,
        }

        const saveData = RoutineCollaboratorCreateSchema.safeParse(rawData);
        if (!saveData.success) {
            console.error(saveData.error)
            return;
        }

        const response = await addRoutineCollaborator(saveData.data)
        if (!response.success) {
            console.error(response.error)
        }

        router.refresh();
    }

    const handleRemoveCollaborator = async (id: string) => {
        await removeRoutineCollaborator(id)
        router.refresh();
    }

    return (
        <>
            <div className="flex justify-between items-center p-4 bg-white border-b">
                <Button
                    variant={"outline"}
                    onClick={goBack}
                >
                    Zurück
                </Button>

                <div className={"flex gap-4 items-center"}>
                    {coachOptions.length > 0
                        ? <Select
                            options={coachOptions}
                            defaultValue={selectedCoach}
                            onChange={setSelectedCoach}
                        />
                        : <span>Keine auswählbar</span>
                    }

                    <Button
                        variant={"outline"}
                        onClick={handleAddCollaborator}
                        startIcon={<PlusIcon />}
                        disabled={selectedCoach === undefined}
                    >
                        Mitwirkenden hinzufügen
                    </Button>
                </div>
            </div>

            {collaborators.map((collaborator) => {
                const coachName = coaches.find((coach) =>
                    coach.userId === collaborator.userId,
                )?.name;
                return (
                    <div
                        className={"flex gap-4 justify-between items-center"}
                        key={collaborator.id}
                    >
                        <span>{coachName ?? collaborator.userId}</span>

                        <Button
                            variant={"outline"}
                            onClick={() => handleRemoveCollaborator(collaborator.id)}
                            startIcon={<TrashBinIcon />}
                        >
                            {''}
                        </Button>
                    </div>
                );
            })}

            {collaborators.length === 0 && (
                <span>Noch keine Mitwirkenden vorhanden.</span>
            )}
        </>
    )
}