"use client"

import Form from "@/components/form/Form";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal/Modal";
import { PlusIcon } from "@/icons";
import { RoutineCreateData, RoutineCreateSchema } from "@/schemas/routine.schema";
import { TeamListData } from "@/schemas/team.schema";
import { saveRoutine } from "@/services/routine.api";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface AddRoutineModalProps {
    teams: TeamListData[] | undefined;
}

export function AddRoutineModal({ teams }: AddRoutineModalProps) {
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);

    const [name, setName] = useState<string>("");
    const [selectedTeam, setSelectedTeam] = useState<string | undefined>(undefined)

    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState<boolean>(false)

    const parseTeamsToOptions = () => {
        return teams?.map(team => {
            return {
                value: team.id,
                label: team.name,
            }
        }) ?? [];
    }

    const resetForm = () => {
        setName("");
        setSelectedTeam(undefined);
    }

    const onClose = () => {
        resetForm();
        setIsOpen(false);
    }

    const handleCreateRoutine = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});

        const rawData = {
            name: name ?? null,
            team_id: selectedTeam ?? null,
        } as RoutineCreateData;

        const result = RoutineCreateSchema.safeParse(rawData);

        if (!result.success) {
            setLoading(false);

            const newFieldErrors: Record<string, string> = {};

            result.error.issues.forEach((issue) => {
                const path = issue.path.join('.');
                newFieldErrors[path] = issue.message;
            });

            setFieldErrors(newFieldErrors);

            setError("Bitte korrigieren Sie die markierten Fehler im Formular.");
            return;
        }

        setLoading(true);

        const validatedData = result.data;
        const apiResponse = await saveRoutine(validatedData);

        setLoading(false);

        if (!apiResponse.success) {
            setError("Es ist ein Fehler aufgetreten. " + apiResponse.error);
        } else {
            const id = apiResponse.id;
            resetForm();
            setIsOpen(false);
            router.push(`/routine-builder/${id}`);
        }
    }

    return (
        <>
            <Button
                variant={"outline"}
                onClick={() => setIsOpen(true)}
                startIcon={<PlusIcon />}
            >
                Routine hinzufügen
            </Button>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
            >
                <div>
                    <div className="px-6 py-5">
                        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                            Benutzer hinzufügen
                        </h3>

                        <Form onSubmit={handleCreateRoutine}>
                            <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-5">
                                <Label
                                    htmlFor="name"
                                    className="dark:text-white/70"
                                >
                                    Name*
                                </Label>
                                <div className="flex flex-col gap-1">
                                    <Input
                                        id="name"
                                        type="text"
                                        defaultValue={name}
                                        placeholder="Allstars 26/27"
                                        onChange={(e) => setName(e.target.value)}
                                        className={fieldErrors.name ? "border-red-500" : ""}

                                    />
                                    {fieldErrors.name && (
                                        <p className="text-xs text-red-500">{fieldErrors.name}</p>
                                    )}
                                </div>

                                <Label
                                    htmlFor="team_id"
                                    className="dark:text-white/70"
                                >Team</Label>
                                <div className="flex flex-col gap-1">
                                    <Select
                                        options={parseTeamsToOptions()}
                                        onChange={setSelectedTeam}
                                    />
                                    {fieldErrors.team_id && (
                                        <p className="text-xs text-red-500">{fieldErrors.team_id}</p>
                                    )}
                                </div>

                                {error && (
                                    <p className="mt-4 text-sm text-error-500">
                                        {error}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition w-full sm:w-auto bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-4 py-3 text-sm"
                                >
                                    {loading ? "Speichern..." : "Anlegen"}
                                </button>
                            </div>
                        </Form>
                    </div>
                </div>
            </Modal>
        </>
    )
}