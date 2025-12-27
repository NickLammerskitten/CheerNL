"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import RichTextEditor, { RichTextEditorHandle } from "@/components/form/richt-text-editor";
import Button from "@/components/ui/button/Button";
import { EventCreateSchema } from "@/schemas/event.schema";
import { saveEvent } from "@/services/event.api";
import { EventType } from "@/types/event-type";
import { toDateTimeLocalString } from "@/utils/date-time-to-locale-string";
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';

export default function EventCreateForm() {
    const router = useRouter();
    const editorRef = useRef<RichTextEditorHandle>(null);

    const [title, setTitle] = useState<string>("");
    const [type, setType] = useState<EventType>(EventType.TUMBLINGClASS);
    const [regFrom, setRegFrom] = useState<string>(toDateTimeLocalString(new Date()));
    const [regTill, setRegTill] = useState<string>(toDateTimeLocalString(new Date()));

    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleGetDescription = () => {
        return editorRef.current?.getContent();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});

        const description = handleGetDescription();

        const rawData = {
            title: title,
            type: type.toString(),
            description: description ?? "",
            registration_from: new Date(regFrom).toISOString(),
            registration_till: new Date(regTill).toISOString()
        };

        const result = EventCreateSchema.safeParse(rawData);

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
        const apiResponse = await saveEvent(validatedData);

        setLoading(false);

        if (!apiResponse.success) {
            setError(apiResponse.error);
        } else {
            // navigate to detail page
            const newId = apiResponse.id;
            router.push('/events/' + newId);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
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
                        placeholder="Event Titel"
                        className={fieldErrors.title ? "border-red-500" : ""}
                    />
                    {fieldErrors.title && (
                        <p className="text-xs text-red-500">{fieldErrors.title}</p>
                    )}
                </div>

                <Label
                    htmlFor="type"
                    className="dark:text-white/70"
                >Event Typ</Label>
                <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value as EventType)}
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm dark:border-gray-600 dark:text-white/90"
                >
                    {Object.values(EventType).map((enumValue) => (
                        <option
                            key={enumValue}
                            value={enumValue}
                        >
                            {enumValue === EventType.TUMBLINGClASS ? 'Tumbling Class' : enumValue}
                        </option>
                    ))}
                </select>

                <Label
                    htmlFor="description"
                    className="self-start pt-3 dark:text-white/70"
                >Beschreibung</Label>
                <div className="flex flex-col gap-1">
                    <RichTextEditor ref={editorRef} />
                    {fieldErrors.description && (
                        <p className="text-xs text-red-500">{fieldErrors.description}</p>
                    )}
                </div>

                <Label
                    htmlFor="regFrom"
                    className="dark:text-white/70"
                >Registrierung von</Label>
                <div className="flex flex-col gap-1">
                    <Input
                        id="regFrom"
                        type="datetime-local"
                        defaultValue={regFrom}
                        onChange={(e) => setRegFrom(e.target.value)}
                        className={fieldErrors.registration_from ? "border-red-500" : ""}
                    />
                    {fieldErrors.registration_from && (
                        <p className="text-xs text-red-500">{fieldErrors.registration_from}</p>
                    )}
                </div>
                {/* Registrierung Bis */}
                <Label
                    htmlFor="regTill"
                    className="dark:text-white/70"
                >Registrierung bis</Label>
                <div className="flex flex-col gap-1">
                    <Input
                        id="regTill"
                        type="datetime-local"
                        defaultValue={regTill}
                        onChange={(e) => setRegTill(e.target.value)}
                        className={fieldErrors.registration_till ? "border-red-500" : ""}
                    />
                    {fieldErrors.registration_till && (
                        <p className="text-xs text-red-500">{fieldErrors.registration_till}</p>
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
                    onClick={() => router.back()} // Zurück zur vorherigen Seite
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
    );
}