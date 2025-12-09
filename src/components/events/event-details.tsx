import { EventDetailData } from "@/schemas/event.schema";
import { EventType } from "@/types/event-type";

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
            <div className="dark:text-white/90">
                {event.description ?? 'Keine Beschreibung'}
            </div>

            <div className="font-medium dark:text-white/70">Registrierung</div>
            <div className="dark:text-white/90">
                von {event.registrationFrom.toLocaleString('de-DE')}
                <br /> bis {event.registrationTill.toLocaleString('de-DE')}
            </div>
        </div>
    )
}
