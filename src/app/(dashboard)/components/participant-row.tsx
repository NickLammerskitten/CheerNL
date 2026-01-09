import { EventRegistrationData } from "@/schemas/event-slot-registration.schema";
import React from "react";

interface ParticipantRowProps {
    participant: EventRegistrationData;
}

export const ParticipantRow: React.FC<ParticipantRowProps> = ({ participant: participant }) => {
    return (
        <li className="group p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Avatar & Name */}
            <div className="flex items-center gap-3 w-full sm:w-1/2 min-w-0">
                <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300 flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                    {participant.firstName.charAt(0)}{participant.lastName.charAt(0)}
                </div>
                <div className="truncate">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {participant.firstName} {participant.lastName}
                    </p>
                    {participant.email && (
                        <p className="text-xs text-gray-400 truncate">{participant.email}</p>
                    )}
                    <div>
                        {participant.phone && (
                            <a
                                href={`tel:${participant.phone}`}
                                className="text-xs text-gray-400 hover:text-brand-600 flex"
                            >
                                {participant.phone}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Notizen */}
            <div className="shrink-0 text-left w-full sm:w-1/2 min-w-0">
                {participant.note ? (
                    <div className="bg-yellow-50 border border-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-900/30 dark:text-yellow-200 text-xs p-2 rounded-lg inline-block max-w-full break-words">
                        <span className="font-semibold mr-1">Hinweis:</span>
                        {participant.note}
                    </div>
                ) : (
                    <span className="text-xs text-gray-300 italic group-hover:text-gray-400">- Keine Notiz -</span>
                )}
            </div>
        </li>
    );
};