"use client"

import EventCalendar from "@/app/(dashboard)/components/event-calendar";
import { EventSlotOccurrence } from "@/schemas/event-slot-occurence.schema";
import { fetchEventSlotOccurences } from "@/services/event-slot-occurence/event-slot-occurence.api";
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import React, { useEffect, useState } from "react";

export default function CalendarWrapper() {

    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<EventSlotOccurrence[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);

            const fromMonth = startOfMonth(currentDate);
            const toMonth = endOfMonth(currentDate);

            const from = startOfWeek(fromMonth, { weekStartsOn: 1 });
            const to = endOfWeek(toMonth, { weekStartsOn: 1 });

            try {
                const response = await fetchEventSlotOccurences(from, to);
                console.log("response", response, from, to);
                const newEvents = response.data;
                setEvents(newEvents);
            } catch (error) {
                console.error("Fehler beim Laden", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [currentDate]);

    return (
        <EventCalendar
            events={events}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            isLoading={isLoading}
        />
    )
}