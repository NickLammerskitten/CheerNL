import { EventDetailData } from "@/schemas/event.schema";
import { EventType } from "@/types/event-type";
import { parseHtmlOrDefault } from "@/utils/parse-html-or-default";
import { format } from "date-fns";
import React from "react";

import 'quill/dist/quill.snow.css';

interface EventDetailsProps {
    event: EventDetailData
}

export default function EventDetails({ event }: EventDetailsProps) {

    return (
        <div className={"grid grid-cols-[auto_1fr] gap-x-4 gap-y-1"}>
            <div className="font-medium dark:text-white/70">Event Typ</div>
            <div className="dark:text-white/90">
                {event.type === EventType.TUMBLINGClASS ? 'Tumbling Class' : event.type}
            </div>

            <div className="font-medium dark:text-white/70">Beschreibung</div>
            <div className="ql-snow">
                <div
                    className="ql-editor dark:text-white/90"
                    dangerouslySetInnerHTML={{
                        __html: parseHtmlOrDefault(event.description as string, 'Keine Beschreibung'),
                    }}
                />
            </div>

            <div className="font-medium dark:text-white/70">Registrierung</div>
            <div className="dark:text-white/90">
                von {format(event.registrationFrom, "dd.MM.yyyy HH:mm")}
                <br /> bis {format(event.registrationTill, "dd.MM.yyyy HH:mm")}
            </div>
        </div>
    )
}
