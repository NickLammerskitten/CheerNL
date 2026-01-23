"use client"

import { PencilIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { Modal } from "@/components/ui/modal/Modal";
import { CoachListData, CoachUpdateData, CoachUpdateSchema } from "@/schemas/coach.schema";
import Label from "@/components/form/Label";
import MultiSelect from "@/components/form/MultiSelect";
import { TeamListData } from "@/schemas/team.schema";
import Form from "@/components/form/Form";
import { useRouter } from "next/navigation";
import { updateCoach } from "@/services/coach.api";

interface EditCoachModalProps {
    coach: CoachListData;
    teams: TeamListData[] | undefined;
}

export default function EditCoachModal({coach, teams}: EditCoachModalProps) {
    const router = useRouter();

    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const [selectedTeams, setSelectedTeams] = useState<string[]>(coach.teams.map(team => team.teamId))

    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const parseTeamsToOptions = () => {
        return teams?.map(team => {
            return {
                value: team.id,
                text: team.name,
                selected: selectedTeams.includes(team.id)
            }
        }) ?? [];
    }

    const closeModal = () => {
        setModalOpen(false)
    }

    const handleAction = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});

        const rawData = {
            id: coach.id,
            team_ids: selectedTeams
        } as CoachUpdateData

        const result = CoachUpdateSchema.safeParse(rawData);

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
        const apiResponse = await updateCoach(validatedData);

        setLoading(false);

        if (!apiResponse.success) {
            setError("Es ist ein Fehler aufgetreten. " + apiResponse.error);
        } else {
            setModalOpen(false);
            router.refresh();
        }
    }

    return (
        <>
            <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => setModalOpen(true)}
            >
                <PencilIcon/>
            </Button>

            <Modal
                isOpen={modalOpen}
                onClose={() => closeModal()}
            >
                <ComponentCard title={`Coach ${coach.name} bearbeiten`}>
                    <Form onSubmit={handleAction}>
                        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-5 items-baseline md:align-baseline">
                            <Label>Teams</Label>
                            <div className="flex flex-col gap-1">
                                <MultiSelect
                                    label={''}
                                    defaultSelected={selectedTeams}
                                    options={parseTeamsToOptions()}
                                    onChange={setSelectedTeams}
                                />
                                {fieldErrors.team_ids && (
                                    <p className="text-xs text-red-500">{fieldErrors.team_ids}</p>
                                )}
                            </div>
                        </div>

                        {error && (
                            <p className="mt-4 text-sm text-error-500">
                                {error}
                            </p>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition w-full sm:w-auto bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-4 py-3 text-sm"
                            >
                                {loading ? "Speichern..." : "Änderungen speichern"}
                            </button>
                        </div>
                    </Form>
                </ComponentCard>
            </Modal>

        </>
    )
}