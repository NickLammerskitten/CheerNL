"use client"

import Form from "@/components/form/Form";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { TrainingPlanAthleteCreateSchema } from "@/schemas/training-plan-athlete.schema";
import { TrainingPlanListData } from "@/schemas/training-plan.schema";
import { saveTrainingPlanAthlete } from "@/services/training-plan-athlete.api";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface TrainingPlanAthleteCreateFormProps {
    trainingPlans: TrainingPlanListData | undefined;
}

export default function TrainingPlanAthleteCreateForm({ trainingPlans }: TrainingPlanAthleteCreateFormProps) {
    const router = useRouter();

    const [selectedTrainingPlan, setSelectedTrainingPlan] = useState<string | undefined>(undefined);
    const [firstName, setFirstName] = useState<string | undefined>(undefined);
    const [lastName, setLastName] = useState<string | undefined>(undefined);
    const [googleEmailAddress, setGoogleEmailAddress] = useState<string | undefined>();

    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const parseTrainingPlansToOptions = () => {
        return trainingPlans?.map((trainingPlan) => {
            return {
                value: trainingPlan.id,
                label: trainingPlan.name,
            }
        }) ?? []
    }

    const handleSubmit = async () => {
        setError(null);
        setFieldErrors({});

        const rawData = {
            training_plan_id: selectedTrainingPlan,
            first_name: firstName,
            last_name: lastName,
            google_email_address: googleEmailAddress,
        };

        const result = TrainingPlanAthleteCreateSchema.safeParse(rawData);

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
        const apiResponse = await saveTrainingPlanAthlete(validatedData);

        setLoading(false);

        if (!apiResponse.success) {
            setError(apiResponse.error);
        } else {
            // navigate back
            router.push('/training-plan');
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-5">

                <Label
                    htmlFor="firstName"
                    className="dark:text-white/70"
                >Vorname</Label>
                <div className="flex flex-col gap-1">
                    <Input
                        id="firstName"
                        type="text"
                        defaultValue={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Vorname"
                        className={fieldErrors.first_name ? "border-red-500" : ""}
                    />
                    {fieldErrors.first_name && (
                        <p className="text-xs text-red-500">{fieldErrors.first_name}</p>
                    )}
                </div>

                <Label
                    htmlFor="lastName"
                    className="dark:text-white/70"
                >Nachname</Label>
                <div className="flex flex-col gap-1">
                    <Input
                        id="lastName"
                        type="text"
                        defaultValue={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Nachname"
                        className={fieldErrors.last_name ? "border-red-500" : ""}
                    />
                    {fieldErrors.last_name && (
                        <p className="text-xs text-red-500">{fieldErrors.last_name}</p>
                    )}
                </div>

                <Label
                    htmlFor="googleEmailAddress"
                    className="dark:text-white/70"
                >Google Email</Label>
                <div className="flex flex-col gap-1">
                    <Input
                        id="googleEmailAddress"
                        type="email"
                        defaultValue={googleEmailAddress}
                        onChange={(e) => setGoogleEmailAddress(e.target.value)}
                        placeholder="vorname.nachname@gmail.com"
                        className={fieldErrors.google_email_address ? "border-red-500" : ""}
                    />
                    {fieldErrors.google_email_address && (
                        <p className="text-xs text-red-500">{fieldErrors.google_email_address}</p>
                    )}
                </div>

                {trainingPlans && (
                    <>
                        <Label
                            htmlFor="trainingPlan"
                            className="dark:text-white/70"
                        >Trainingsplan</Label>
                        <div className="flex flex-col gap-1">
                            <Select
                                options={parseTrainingPlansToOptions()}
                                onChange={setSelectedTrainingPlan}
                            />
                            {fieldErrors.training_plan_id && (
                                <p className="text-xs text-red-500">{fieldErrors.training_plan_id}</p>
                            )}
                        </div>
                    </>
                )}
            </div>

            {error && (
                <p className="mt-4 text-sm text-error-500">
                    {error}
                </p>
            )}

            <div className="flex justify-end gap-3 mt-6">
                <Button
                    variant={"outline"}
                    onClick={() => router.back()} // Zurück zur vorherigen Seite
                >
                    Abbrechen
                </Button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition w-full sm:w-auto bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-4 py-3 text-sm"
                >
                    {loading ? "Speichern..." : "Anlegen"}
                </button>
            </div>
        </Form>
    )
}