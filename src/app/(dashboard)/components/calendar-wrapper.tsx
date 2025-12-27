"use client"

import EventCalendar from "@/app/(dashboard)/components/event-calendar";
import Checkbox from "@/components/form/input/Checkbox";
import { EventSlotOccurrence } from "@/schemas/event-slot-occurence.schema";
import { fetchMyCoachObject } from "@/services/coach.api";
import { fetchEventSlotOccurrences } from "@/services/event-slot-occurence/event-slot-occurence.api";
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import React, { useEffect, useState } from "react";

export default function CalendarWrapper() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showMyEventsOnly, setShowMyEventsOnly] = useState(false);

    const [events, setEvents] = useState<EventSlotOccurrence[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);

            const fromMonth = startOfMonth(currentDate);
            const toMonth = endOfMonth(currentDate);

            const from = startOfWeek(fromMonth, { weekStartsOn: 1 });
            const to = endOfWeek(toMonth, { weekStartsOn: 1 });

            const currentCoachId = await fetchMyCoachObject().then((coach) => coach?.id);
            const filterIds = showMyEventsOnly && currentCoachId ? [currentCoachId] : [];

            try {
                const response = await fetchEventSlotOccurrences(from, to, filterIds);
                const newEvents = response.data;
                setEvents(newEvents);
            } catch (error) {
                console.error("Fehler beim Laden", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [currentDate, showMyEventsOnly]);

    return (
        <div className="flex flex-col gap-4">
            <div className={"flex flex-col gap-0.5"}>
                <span className={"dark:text-white/70"}>Filter:{' '}</span>
                <div className="flex px-4">
                    <Checkbox
                        checked={showMyEventsOnly}
                        onChange={setShowMyEventsOnly}
                        label={'Nur meine Events anzeigen'}
                    />
                </div>
            </div>

            <EventCalendar
                events={events}
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                isLoading={isLoading}
            />
        </div>
    )
}