"use client"

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import {
    RoutineAthleteCreateData,
    RoutineAthleteCreateSchema,
    RoutineAthleteItemData,
    RoutineAthleteUpdateData,
    RoutineAthleteUpdateSchema,
} from "@/schemas/routine-athlete.schema";
import { saveAthlete } from "@/services/routine.api";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface RoutineAthleteListProps {
    routineId: string;
    athletes: RoutineAthleteItemData[];
}

export default function RoutineAthleteList({ routineId, athletes }: RoutineAthleteListProps) {
    const router = useRouter();

    useEffect(() => {
        const supabase = createClient();

        const channel = supabase.channel(`routine_${routineId}`)

            // EVENT: Neuer Athlet erstellt
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'routine_athlete',
                    filter: `routine_id=eq.${routineId}`,
                },
                () => {
                    router.refresh();
                },
            )

            // EVENT: Athlet aktualisiert
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'routine_athlete',
                    filter: `routine_id=eq.${routineId}`,
                },
                () => {
                    router.refresh();
                },
            )

            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [routineId]);

    const goBack = () => {
        router.back();
    }

    const handleAddAthlete = async () => {
        const rawData = {
            routine_id: routineId,
            name: null,
        } as RoutineAthleteCreateData;

        const saveData = RoutineAthleteCreateSchema.safeParse(rawData);

        if (!saveData.success) {
            console.error(saveData.error)
            return;
        }

        const result = await saveAthlete(saveData.data);
        if (!result.success) {
            console.error('An error occurred while saving formation');
            return;
        }
    }

    const handleAthleteNameChange = async (athlete_id: string, name: string | undefined) => {
        const rawData = {
            id: athlete_id,
            routine_id: routineId,
            name: name ?? null,
        } as RoutineAthleteUpdateData;

        const saveData = RoutineAthleteUpdateSchema.safeParse(rawData);

        if (!saveData.success) {
            console.error(saveData.error)
            return;
        }

        const result = await saveAthlete(saveData.data);
        if (!result.success) {
            console.error('An error occurred while saving formation');
            return;
        }
    }

    return (
        <>
            <div className="flex justify-between items-center p-4 bg-white border-b">
                <Button variant={"outline"} onClick={goBack}>
                    Zurück
                </Button>

                <Button
                    variant={"outline"}
                    onClick={handleAddAthlete}
                    startIcon={<PlusIcon />}
                >
                    Athlet hinzufügen
                </Button>
            </div>

            {athletes.map(athlete => (
                <div
                    key={athlete.id}
                    className={"flex flex-row w-full gap-4 items-center"}
                >
                    <Label
                        htmlFor="name"
                        className="dark:text-white/70"
                    >{athlete.index + 1}</Label>
                    <div className={"w-full"}>
                        <Input
                            className={"w-full"}
                            id="name"
                            type="text"
                            defaultValue={athlete.name ?? undefined}
                            onChange={(e) => handleAthleteNameChange(athlete.id, e.target.value)}
                        />
                    </div>
                </div>
            ))}
        </>
    )
}