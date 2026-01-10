"use client"

import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchMyCoachObject } from "@/services/coach.api";
import { fetchEventSlotOccurrences } from "@/services/event-slot-occurence/event-slot-occurence.api";
import { EventSlotOccurrence } from "@/schemas/event-slot-occurence.schema";

interface EventCalendarContextType {
    currentDate: Date;
    onDateChange: (date: Date) => void;

    showMyEventsOnly: boolean;
    setShowMyEventsOnly: (showMyEventsOnly: boolean) => void;

    events: EventSlotOccurrence[];
    isLoading: boolean;

    selectedDate: Date;
    setSelectedDate: (selectedDate: Date) => void;

    refreshData: () => void;
}

const EventCalendarContext = createContext<EventCalendarContextType>({} as EventCalendarContextType);

interface EventCalendarProviderProps {
    children: React.ReactNode;
}

export const EventCalendarProvider = ({ children }: EventCalendarProviderProps) => {

    const [currentDate, setCurrentDate] = useState(new Date());
    const [showMyEventsOnly, setShowMyEventsOnly] = useState<boolean>(false);

    const [events, setEvents] = useState<EventSlotOccurrence[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const onDateChange = (date: Date) => {
        setCurrentDate(date);
    }

    const loadData = async () => {
        setIsLoading(true);

        const fromMonth = startOfMonth(currentDate);
        const toMonth = endOfMonth(currentDate);

        const from = startOfWeek(fromMonth, { weekStartsOn: 1 });
        const to = endOfWeek(toMonth, { weekStartsOn: 1 });

        try {
            const currentCoachId = await fetchMyCoachObject().then((coach) => coach?.id);

            const filterIds = showMyEventsOnly && currentCoachId ? [currentCoachId] : [];

            const response = await fetchEventSlotOccurrences(from, to, filterIds);
            const newEvents = response.data;
            setEvents(newEvents);

        } catch (error) {
            console.error("Fehler beim Laden", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [currentDate, showMyEventsOnly]);

    const value: EventCalendarContextType = {
        currentDate,
        onDateChange,

        selectedDate,
        setSelectedDate,

        showMyEventsOnly,
        setShowMyEventsOnly,

        events,
        isLoading,

        refreshData: loadData
    };

    return (
        <EventCalendarContext.Provider value={value}>
            {children}
        </EventCalendarContext.Provider>
    )
}

export const useEventCalendar = () => {
    const context = useContext(EventCalendarContext);
    if (!context) {
        throw new Error("eventCalendarContext must be used within an EventCalendarProvider");
    }
    return context;
}