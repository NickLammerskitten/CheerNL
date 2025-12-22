"use client";

import { EventSlotOccurrence } from "@/schemas/event-slot-occurence.schema";
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    startOfMonth,
    startOfWeek,
    subMonths,
} from "date-fns";
import React, { useMemo, useState } from "react";
import { EventList } from "./event-list";
import { MiniCalendar } from "./mini-calendar";

interface TrainerDashboardProps {
    events: EventSlotOccurrence[];
    currentDate: Date;
    onDateChange: (date: Date) => void;
    isLoading?: boolean;
}

const EventCalendar: React.FC<TrainerDashboardProps> = ({
    events,
    currentDate,
    onDateChange,
    isLoading = false,
}) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // --- Logik ---
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const nextMonth = () => onDateChange(addMonths(currentDate, 1));
    const prevMonth = () => onDateChange(subMonths(currentDate, 1));

    // Filter Events für den ausgewählten Tag
    const selectedDayEvents = useMemo(() => {
        return events
            .filter(event => isSameDay(event.date, selectedDate))
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
    }, [events, selectedDate]);

    // Set für schnelle Abfrage, ob ein Tag Events hat (für die Punkte im Kalender)
    const eventDatesSet = useMemo(() => {
        const set = new Set<string>();
        events.forEach(e => set.add(format(e.date, 'yyyy-MM-dd')));
        return set;
    }, [events]);

    const hasEvents = (date: Date) => eventDatesSet.has(format(date, 'yyyy-MM-dd'));

    // --- Layout ---
    return (
        <div className="flex flex-col lg:flex-row h-full min-h-[600px] gap-6 bg-gray-50 dark:bg-gray-950 p-4">

            {/* Linke Spalte */}
            <MiniCalendar
                currentDate={currentDate}
                selectedDate={selectedDate}
                calendarDays={calendarDays}
                onSelectDate={setSelectedDate}
                onNextMonth={nextMonth}
                onPrevMonth={prevMonth}
                hasEvents={hasEvents}
                isLoading={isLoading}
            />

            {/* Rechte Spalte */}
            <EventList
                selectedDate={selectedDate}
                events={selectedDayEvents}
                isLoading={isLoading}
            />
        </div>
    );
};

export default EventCalendar;