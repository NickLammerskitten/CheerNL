import { ParticipantRow } from "@/app/(dashboard)/components/participant-row";
import { EventSlotOccurrence } from "@/schemas/event-slot-occurence.schema";
import React from "react";

interface EventCardProps {
    event: EventSlotOccurrence;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Card Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-600 border border-brand-100 dark:bg-brand-900/20 dark:border-brand-900/30">
                            EVENT
                        </span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                            🕒 {event.startTime} bis {event.endTime} Uhr
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {event.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        📍 {event.location ?? "Kein Ort angegeben"}
                        {event.coaches.filter((coach) => coach.coachName)?.length > 0 && (
                            <span className="ml-3 text-gray-400">
                                👤 {event.coaches.map((coach) => coach.coachName)
                                .filter((name) => name)
                                .join(", ")}
                            </span>
                        )}
                    </p>
                </div>

                {/* Stats Counter */}
                <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-lg p-3 min-w-[80px]">
                    <span className="block text-xl font-bold text-gray-800 dark:text-white">
                        {event.registrations.length} {event.maxRegistrations && ` von ${event.maxRegistrations}`}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase font-medium">Teilnehmer</span>
                </div>
            </div>

            {/* Teilnehmer Liste */}
            <div className="p-0">
                <div className="bg-gray-50/50 dark:bg-gray-800/30 px-6 py-2 border-b border-gray-100 dark:border-gray-800">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Teilnehmerliste</h4>
                </div>

                {event.registrations.length > 0 ? (
                    <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                        {event.registrations.map((participant) => (
                            <ParticipantRow
                                key={participant.id}
                                participant={participant}
                            />
                        ))}
                    </ul>
                ) : (
                    <div className="p-8 text-center text-gray-400 text-sm">
                        Keine Anmeldungen vorhanden.
                    </div>
                )}
            </div>
        </div>
    );
};