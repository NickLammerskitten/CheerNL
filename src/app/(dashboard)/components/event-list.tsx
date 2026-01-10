import {format, isSameDay, isToday} from "date-fns";
import { de } from "date-fns/locale";
import React, {useMemo} from "react";
import { EventCard } from "./event-card";
import { useEventCalendar } from "@/app/(dashboard)/context/useEventCalendar";

export default function EventList() {
    const { events, isLoading, selectedDate } = useEventCalendar();

    const selectedDayEvents = useMemo(() => {
        return events
            .filter(event => isSameDay(event.date, selectedDate))
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
    }, [events, selectedDate]);

    return (
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto relative">

            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 z-20 bg-gray-50/60 dark:bg-gray-950/60 flex items-start justify-center pt-20 backdrop-blur-[1px]">
                    <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium">
                        <div className="h-4 w-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                        Lade Termine...
                    </div>
                </div>
            )}

            <h2 className="text-xl font-bold text-gray-800 dark:text-white px-1">
                {isToday(selectedDate) ? "Heute, " : ""} {format(selectedDate, "eeee, d. MMMM", { locale: de })}
            </h2>

            {selectedDayEvents.length > 0 ? (
                selectedDayEvents.map((event) => <EventCard
                    key={event.id}
                    event={event}
                />)
            ) : (
                // Empty State
                <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-center p-6">
                    <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-2xl">
                        📆
                    </div>
                    <h3 className="text-gray-900 dark:text-white font-medium">Keine Termine</h3>
                    <p className="text-gray-500 text-sm mt-1">Für dieses Datum liegt nichts vor.</p>
                </div>
            )}
        </div>
    );
};