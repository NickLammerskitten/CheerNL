"use client"

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import MultiSelect from "@/components/form/MultiSelect";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { PlusIcon } from "@/icons";
import { CoachListData } from "@/schemas/coach.schema";
import { EventSlotCreateSchema } from "@/schemas/event-slot.schema";
import { saveEventSlot } from "@/services/event-slot.api";
import { DayOfWeek } from "@/types/day-of-week";
import { RecurrenceType } from "@/types/recurrence-type";
import { dayOfWeekToString } from "@/utils/day-of-week-to-string";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface CreateSlotModalProps {
    eventId: string;
    coaches: CoachListData[] | undefined;
}

export default function CreateSlotModal({ eventId, coaches }: CreateSlotModalProps) {
    const router = useRouter();

    const [createModalOpen, setCreateModalOpen] = useState<boolean>(false)

    const [title, setTitle] = useState<string | undefined>()
    const [location, setLocation] = useState<string | undefined>()
    const [durationMinutes, setDurationMinutes] = useState<number>(90)
    const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>(RecurrenceType.WEEKLY)
    const [slotStart, setSlotStart] = useState<string | undefined>(undefined)
    const [slotEnd, setSlotEnd] = useState<string | undefined>(undefined)
    const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek | undefined>(undefined)
    const [startTime, setStartTime] = useState<string | undefined>(undefined)
    const [selectedCoaches, setSelectedCoaches] = useState<string[]>([]);
    const [maxRegistrations, setMaxRegistrations] = useState<number | undefined>(undefined);

    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const parseCoachesToOptions = () => {
        return coaches?.map((coach) => {
            return {
                value: coach.id,
                text: coach.name,
                selected: false,
            }
        }) ?? []
    }

    const resetForm = () => {
        setTitle(undefined);
        setLocation(undefined);
        setDurationMinutes(90);
        setRecurrenceType(RecurrenceType.WEEKLY);
        setSlotStart(undefined);
        setSlotEnd(undefined);
        setDayOfWeek(undefined);
        setStartTime(undefined);
        setSelectedCoaches([]);
        setMaxRegistrations(undefined);

        setError(null);
        setFieldErrors({});
    }

    const closeCreateModal = () => {
        resetForm();
        setCreateModalOpen(false);
    }

    const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});

        const rawData = {
            event_id: eventId,
            title: title ?? null,
            location: location ?? null,
            duration_minutes: durationMinutes,
            recurrence_type: recurrenceType,
            slot_start: slotStart ?? null,
            slot_end: slotEnd ?? null,
            day_of_week: dayOfWeek ?? DayOfWeek.MONDAY,
            start_time: startTime ?? null,
            coach_ids: selectedCoaches.length > 0 ? selectedCoaches : null,
            max_registrations: maxRegistrations ?? null,
        }

        const result = EventSlotCreateSchema.safeParse(rawData);

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

        const validatedData = result.data;
        const apiResponse = await saveEventSlot(validatedData);

        setLoading(false);

        if (!apiResponse.success) {
            setError(apiResponse.error)
        } else {
            resetForm();
            setCreateModalOpen(false);
            router.refresh();
        }
    }

    return (
        <>
            <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => setCreateModalOpen(true)}
            >
                <PlusIcon /> Erstellen
            </Button>

            <Modal
                showCloseButton={false}
                isOpen={createModalOpen}
                onClose={() => {
                }}
                className={"p-4"}
            >
                <form onSubmit={handleCreateEvent}>
                    <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-5">
                        <Label
                            htmlFor="title"
                            className="dark:text-white/70"
                        >Titel</Label>
                        <div className="flex flex-col gap-1">
                            <Input
                                id="title"
                                type="text"
                                defaultValue={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Titel"
                                className={fieldErrors.title ? "border-red-500" : ""}
                            />
                            {fieldErrors.title && (
                                <p className="text-xs text-red-500">{fieldErrors.title}</p>
                            )}
                        </div>

                        <Label
                            htmlFor="location"
                            className="self-start pt-3 dark:text-white/70"
                        >Ort</Label>
                        <div className="flex flex-col gap-1">
                            <Input
                                id="location"
                                defaultValue={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Kein Ort"
                                className={fieldErrors.location ? "border-red-500" : ""}
                            />
                            {fieldErrors.location && (
                                <p className="text-xs text-red-500">{fieldErrors.location}</p>
                            )}
                        </div>

                        <Label
                            htmlFor="type"
                            className="dark:text-white/70"
                        >Typ*</Label>
                        <div className="flex flex-col gap-1">
                            <select
                                id="type"
                                value={recurrenceType}
                                onChange={(e) => setRecurrenceType(e.target.value as RecurrenceType)}
                                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm dark:border-gray-600 dark:text-white/90"
                            >
                                {Object.values(RecurrenceType).map((enumValue) => (
                                    <option
                                        key={enumValue}
                                        value={enumValue}
                                    >
                                        {enumValue === RecurrenceType.WEEKLY
                                            ? 'Wöchentlich'
                                            : enumValue === RecurrenceType.ONCE ? 'Einmalig' : enumValue}
                                    </option>
                                ))}
                            </select>
                            {fieldErrors.recurrence_type && (
                                <p className="text-xs text-red-500">{fieldErrors.recurrence_type}</p>
                            )}
                        </div>

                        {recurrenceType === RecurrenceType.WEEKLY ? (
                            <>
                                <Label
                                    htmlFor="slotStart"
                                    className="dark:text-white/70"
                                >Von*</Label>
                                <div className="flex flex-col gap-1">
                                    <Input
                                        id="slotStart"
                                        type="date"
                                        defaultValue={slotStart}
                                        onChange={(e) => setSlotStart(e.target.value)}
                                        className={fieldErrors.slot_start ? "border-red-500" : ""}
                                    />
                                    {fieldErrors.slot_start && (
                                        <p className="text-xs text-red-500">{fieldErrors.slot_start}</p>
                                    )}
                                </div>

                                <Label
                                    htmlFor="slotEnd"
                                    className="dark:text-white/70"
                                >Bis*</Label>
                                <div className="flex flex-col gap-1">
                                    <Input
                                        id="slotEnd"
                                        type="date"
                                        defaultValue={slotEnd}
                                        onChange={(e) => setSlotEnd(e.target.value)}
                                        className={fieldErrors.slot_end ? "border-red-500" : ""}
                                    />
                                    {fieldErrors.slot_end && (
                                        <p className="text-xs text-red-500">{fieldErrors.slot_end}</p>
                                    )}
                                </div>

                                <Label
                                    htmlFor="dayOfWeek"
                                    className="dark:text-white/70"
                                >Wochentag*</Label>
                                <div className="flex flex-col gap-1">
                                    <select
                                        id="type"
                                        value={dayOfWeek}
                                        onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
                                        className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm dark:border-gray-600 dark:text-white/90"
                                    >
                                        {Object.values(DayOfWeek).map((enumValue) => (
                                            <option
                                                key={enumValue}
                                                value={enumValue}
                                            >
                                                {dayOfWeekToString(enumValue)}
                                            </option>
                                        ))}
                                    </select>
                                    {fieldErrors.day_of_week && (
                                        <p className="text-xs text-red-500">{fieldErrors.day_of_week}</p>
                                    )}
                                </div>

                                <Label
                                    htmlFor="startTime"
                                    className="dark:text-white/70"
                                >Startzeit*</Label>
                                <div className="flex flex-col gap-1">
                                    <Input
                                        id="startTime"
                                        type="time"
                                        defaultValue={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className={fieldErrors.start_time ? "border-red-500" : ""}
                                    />
                                    {fieldErrors.start_time && (
                                        <p className="text-xs text-red-500">{fieldErrors.start_time}</p>
                                    )}
                                </div>
                            </>
                        ) : RecurrenceType.ONCE ? (
                            <>
                                <Label
                                    htmlFor="slotStart"
                                    className="dark:text-white/70"
                                >Ereignis Start*</Label>
                                <div className="flex flex-col gap-1">
                                    <Input
                                        id="slotStart"
                                        type="datetime-local"
                                        defaultValue={slotStart}
                                        onChange={(e) => setSlotStart(e.target.value)}
                                        className={fieldErrors.slot_start ? "border-red-500" : ""}
                                    />
                                    {fieldErrors.slot_start && (
                                        <p className="text-xs text-red-500">{fieldErrors.slot_start}</p>
                                    )}
                                </div>
                            </>
                        ) : (<></>)}

                        <Label
                            htmlFor="duration"
                            className="dark:text-white/70"
                        >Dauer (in Minuten)*</Label>
                        <div className="flex flex-col gap-1">
                            <Input
                                id="duration"
                                type="number"
                                defaultValue={durationMinutes}
                                onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 0)}
                                placeholder="0"
                                className={fieldErrors.duration_minutes ? "border-red-500" : ""}
                            />
                            {fieldErrors.duration_minutes && (
                                <p className="text-xs text-red-500">{fieldErrors.duration_minutes}</p>
                            )}
                        </div>

                        {coaches && (
                            <>
                                <Label
                                    htmlFor="coaches"
                                    className="dark:text-white/70"
                                >Coaches</Label>
                                <div className="flex flex-col gap-1">
                                    <MultiSelect
                                        label={''}
                                        options={parseCoachesToOptions()}
                                        onChange={setSelectedCoaches}
                                    />
                                    {fieldErrors.coach_ids && (
                                        <p className="text-xs text-red-500">{fieldErrors.coach_ids}</p>
                                    )}
                                </div>
                            </>
                        )}

                        <Label
                            htmlFor="maxRegistrations"
                            className="dark:text-white/70"
                        >Maximale Teilnehmer</Label>
                        <div className="flex flex-col gap-1">
                            <Input
                                id="maxRegistrations"
                                type="number"
                                defaultValue={maxRegistrations}
                                onChange={(e) => setMaxRegistrations(parseInt(e.target.value) || undefined)}
                                placeholder="0"
                                className={fieldErrors.max_registrations ? "border-red-500" : ""}
                            />
                            {fieldErrors.max_registrations && (
                                <p className="text-xs text-red-500">{fieldErrors.max_registrations}</p>
                            )}
                        </div>
                    </div>

                    {error && (
                        <p className="mt-4 text-sm text-error-500">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            variant={"outline"}
                            onClick={() => closeCreateModal()}
                        >
                            Abbrechen
                        </Button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition w-full sm:w-auto bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-4 py-3 text-sm"
                        >
                            {loading ? "Speichern..." : "Änderungen speichern"}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    )
}