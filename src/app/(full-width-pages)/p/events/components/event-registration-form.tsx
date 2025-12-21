"use client"

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select, { Option } from "@/components/form/Select";
import Alert from "@/components/ui/alert/Alert";
import { EventPublicDetailData } from "@/schemas/event-public.schema";
import { EventRegistrationPublicCreateSchema } from "@/schemas/event-registration-public.schema";
import { EventSlotPublicListData } from "@/schemas/event-slot-public.schema";
import { TeamPublicListData } from "@/schemas/team-public.schema";
import { saveEventRegistration } from "@/services/event-registration-public.api";
import { EventType } from "@/types/event-type";
import { RecurrenceType } from "@/types/recurrence-type";
import { dayOfWeekToString } from "@/utils/day-of-week-to-string";
import { parseHtmlOrDefault } from "@/utils/parse-html-or-default";
import React, { useState } from "react";

import 'quill/dist/quill.snow.css';

interface EventRegistrationFormProps {
    event: EventPublicDetailData;
    teams: TeamPublicListData[];
}

export default function EventRegistrationForm({ teams, event }: EventRegistrationFormProps) {

    const teamOptions = teams.map((team) => {
        return {
            value: team.id,
            label: team.name,
        } as Option
    });

    const slots = event.slots.map((slot) => {
        return {
            value: slot.id,
            label: slotName(slot),
        } as Option
    })

    const [team, setTeam] = useState<string | undefined>()
    const [slot, setSlot] = useState<string | undefined>()

    const [firstName, setFirstName] = useState<string | undefined>()
    const [lastName, setLastName] = useState<string | undefined>()
    const [email, setEmail] = useState<string | undefined>()
    const [phone, setPhone] = useState<string | undefined>()
    const [note, setNote] = useState<string | undefined>()

    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState<boolean>(false)

    const handleTeamChange = (teamId: string) => {
        setTeam(teamId)
    }

    const handleSlotChange = (slotId: string) => {
        setSlot(slotId)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});

        const rawData = {
            event_id: event.id,
            event_slot_id: slot ?? "",
            team_id: team ?? "",
            first_name: firstName ?? "",
            last_name: lastName ?? "",
            email: email ?? "",
            phone: phone ?? "",
            note: note ?? null,
        };

        const result = EventRegistrationPublicCreateSchema.safeParse(rawData);

        if (!result.success) {
            setLoading(false);

            const newFieldErrors: Record<string, string> = {};

            result.error.issues.forEach((issue) => {
                const path = issue.path.join('.');
                newFieldErrors[path] = issue.message;
            })

            setFieldErrors(newFieldErrors);

            setError("Bitte korrigiere die markierten Felder im Formular.")
            return;
        }

        setLoading(true);

        const validatedData = result.data;
        const apiResponse = await saveEventRegistration(validatedData);

        setLoading(false)

        if (!apiResponse.success) {
            setError(apiResponse.error);
            setSuccess(false);
        } else {
            setError(null);
            setSuccess(true);

            // TODO: Success Page with ICal download
        }
    }

    return (
        <>
            <div className="ql-snow">
                <div
                    className="ql-editor dark:text-white/90"
                    dangerouslySetInnerHTML={{
                        __html: parseHtmlOrDefault(event.description as string, 'Keine' +
                            ' Beschreibung'),
                    }}
                />
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-5">
                    <Label>Team</Label>
                    <div className="flex flex-col gap-1">
                        <Select
                            options={teamOptions}
                            placeholder={"Wähle dein Team aus"}
                            onChange={handleTeamChange}
                            className={fieldErrors.team_id ? "border-red-500" : ""}
                        ></Select>
                        {fieldErrors.team_id && (
                            <p className="text-xs text-red-500">{fieldErrors.team_id}</p>
                        )}
                    </div>

                    <Label>{event.type === EventType.TUMBLINGClASS ? "Classes" : ""}</Label>
                    <div>
                        <Select
                            options={slots}
                            placeholder={"Wähle aus"}
                            onChange={handleSlotChange}
                            className={fieldErrors.event_slot_id ? "border-red-500" : ""}
                        ></Select>
                        {fieldErrors.event_slot_id && (
                            <p className="text-xs text-red-500">{fieldErrors.event_slot_id}</p>
                        )}
                    </div>

                    {slot && (
                        <>
                            <div></div>
                            <div>
                                {
                                    "Titel: " + slotTitle(event.slots.find((slotEntry) => slotEntry.id === slot)!)
                                }<br />

                                {
                                    "Zeit: " + (slotTime(event.slots.find((slotEntry) => slotEntry.id === slot)!)
                                        ?? "Keine Zeit")
                                }<br />

                                {
                                    "Coaches: " + (slotCoaches(event.slots.find((slotEntry) => slotEntry.id === slot)!)
                                        ?? "Keine Coaches")
                                }
                            </div>
                        </>
                    )}

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
                        htmlFor="email"
                        className="dark:text-white/70"
                    >E-Mail</Label>
                    <div className="flex flex-col gap-1">
                        <Input
                            id="email"
                            type="email"
                            defaultValue={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="E-Mail"
                            className={fieldErrors.email ? "border-red-500" : ""}
                        />
                        {fieldErrors.email && (
                            <p className="text-xs text-red-500">{fieldErrors.email}</p>
                        )}
                    </div>

                    <Label
                        htmlFor="phone"
                        className="dark:text-white/70"
                    >Telefonnummer</Label>
                    <div className="flex flex-col gap-1">
                        <Input
                            id="phone"
                            type="text"
                            defaultValue={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Telefonnummer"
                            className={fieldErrors.phone ? "border-red-500" : ""}
                        />
                        {fieldErrors.phone && (
                            <p className="text-xs text-red-500">{fieldErrors.phone}</p>
                        )}
                    </div>

                    <Label
                        htmlFor="note"
                        className="dark:text-white/70"
                    >
                        {event.type === EventType.TUMBLINGClASS
                            ? "Lernziel"
                            : "Notiz"}
                    </Label>
                    <div className="flex flex-col gap-1">
                        <Input
                            id="note"
                            type="text"
                            defaultValue={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Notiz"
                            className={fieldErrors.note ? "border-red-500" : ""}
                        />
                        {fieldErrors.note && (
                            <p className="text-xs text-red-500">{fieldErrors.note}</p>
                        )}
                    </div>
                </div>

                <div className={"mt-2"}>
                    {error && (
                        <Alert
                            variant={"error"}
                            title={"Fehler"}
                            message={error}
                        ></Alert>
                    )}

                    {success && (
                        <Alert
                            variant={"success"}
                            title={"Erfolgreich"}
                            message={"Du hast dich erfolgreich registriert"}
                        />
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition w-full sm:w-auto bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-4 py-3 text-sm"
                    >
                        {loading ? "Speichern..." : "Änderungen speichern"}
                    </button>
                </div>
            </form>
        </>
    )
}

const slotName = (slot: EventSlotPublicListData): string => {
    const title = slotTitle(slot);
    const time = slotTime(slot);
    const coaches = slotCoaches(slot);

    const textWithTime = time ? title + ` (${time})` : title;

    return coaches ? textWithTime + ` (Coaches: ${coaches})` : textWithTime;
}

const slotTitle = (slot: EventSlotPublicListData) => {
    return `${slot.title ?? "Kein Titel"}`
}

const slotTime = (slot: EventSlotPublicListData) => {
    return slot.recurrenceType === RecurrenceType.ONCE
        ? `${slot.slotStart?.toLocaleString()}, ${slot.durationMinutes} Min`
        : slot.recurrenceType === RecurrenceType.WEEKLY
            ? `${dayOfWeekToString(slot.dayOfWeek)}, ${slot.startTime}, ${slot.durationMinutes} Min`
            : null;
}

const slotCoaches = (slot: EventSlotPublicListData) => {
    if (slot.coaches.length <= 0) {
        return null
    }

    return slot.coaches.map((coach) => coach.coachName).join(", ")
}