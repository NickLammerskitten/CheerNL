"use client";

import Button from "@/components/ui/button/Button";
import { EventPublicDetailData } from "@/schemas/event-public.schema";
import { generateIcsData } from "@/services/event-slot-occurence/slot-to-ics-mapper";
import { RecurrenceType } from "@/types/recurrence-type";
import { dayOfWeekToString } from "@/utils/day-of-week-to-string";
import { calculateEndTimeOnce, calculateEndTimeRecurrent, calculateStartTimeOnce } from "@/utils/event-time-calculator";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import React from "react";

interface RegistrationSuccessProps {
    event: EventPublicDetailData;
    registeredOnWaitlist: boolean;
    selectedSlotId: string;
    onReset: () => void;
}

export const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
    event,
    registeredOnWaitlist,
    selectedSlotId,
    onReset,
}) => {
    const slot = event.slots.find(s => s.id === selectedSlotId);

    const handleDownloadIcs = () => {
        if (!slot) {
            return;
        }

        const icsString = generateIcsData(slot);

        const blob = new Blob([icsString], { type: "text/calendar;charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${event.title.replace(/\s+/g, '_')}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!slot) {
        return <div className="text-red-500">Fehler: Informationen nicht gefunden.</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-300">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg
                    className="w-10 h-10 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                    ></path>
                </svg>
            </div>

            {registeredOnWaitlist
                ? <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white/90">Warteliste
                        beigetreten!</h2>
                    <p className="text-gray-500 max-w-md mb-8">
                        Du bist erfolgreich für <strong>{event.title} {slot.title && ' - ' + slot.title}</strong> der
                        Warteliste beigetreten. Solltest du einen Platz bekommen, wirst du informiert.
                    </p>
                </>
                : <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white/90">Anmeldung erfolgreich!</h2>
                    <p className="text-gray-500 max-w-md mb-8">
                        Du bist erfolgreich
                        für <strong>{event.title} {slot.title && ' - ' + slot.title}</strong> angemeldet.
                    </p>
                </>
            }

            {/* Event Details Zusammenfassung */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8 w-full max-w-sm border border-gray-100 text-left">
                <div className="mb-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Wann?</span>
                    <p className="font-medium text-gray-800">
                        {slot.slotStart ? (
                            slot.recurrenceType === RecurrenceType.WEEKLY && slot.slotEnd ? (
                                <span>
                                    {format(slot.slotStart, "d. MMMM yyyy", { locale: de })} - {format(slot.slotEnd, "d. MMMM yyyy", { locale: de })}
                                    <span className="block font-normal text-sm text-gray-600 mt-0.5">
                                        {dayOfWeekToString(slot.dayOfWeek)}
                                    </span>

                                    <p className="text-sm text-gray-600">
                                        {slot.startTime?.slice(0, 5)} - {calculateEndTimeRecurrent(slot.startTime, slot.durationMinutes)} Uhr
                                    </p>
                                </span>
                            ) : (
                                <span>
                                    {format(slot.slotStart, "EEEE, d. MMMM yyyy", { locale: de })}

                                    <p className="text-sm text-gray-600">
                                        {calculateStartTimeOnce(slot.slotStart)} - {calculateEndTimeOnce(slot.slotStart, slot.durationMinutes)} Uhr
                                    </p>
                                </span>
                            )
                        ) : (
                            "Datum unbekannt"
                        )}
                    </p>

                </div>
                <div className="mb-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Wo?</span>
                    <p className="font-medium text-gray-800">{slot.location ?? "Nicht angegeben"}</p>
                </div>

                <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Deine Coaches</span>
                    <p className="font-medium text-gray-800">
                        {
                            slot.coaches.map((coach) => coach.coachName)
                                .filter((name) => name)
                                .join(', ') ?? "Nicht angegeben"
                        }
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <Button
                    onClick={handleDownloadIcs}
                    variant={"primary"}
                >
                    <span>📅</span> In Kalender speichern
                </Button>

                <Button
                    onClick={onReset}
                    variant={"outline"}
                >
                    Weitere Person anmelden
                </Button>
            </div>

            <a
                href="/p/events/tumbling-classes"
                className="mt-6 text-sm text-gray-400 hover:text-gray-600 underline"
            >
                Zurück zur Übersicht
            </a>
        </div>
    );
};