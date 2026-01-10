"use client"

import React from "react";
import Checkbox from "@/components/form/input/Checkbox";
import {EventCalendarProvider, useEventCalendar} from "@/app/(dashboard)/context/useEventCalendar";
import MiniCalendar from "@/app/(dashboard)/components/mini-calendar";
import EventList from "@/app/(dashboard)/components/event-list";

export default function CalendarWrapper() {
    return (
        <EventCalendarProvider>
            <div className="flex flex-col gap-4">
                <EventCalendarFilter />

                <div className="flex flex-col lg:flex-row h-full min-h-[600px] gap-6 bg-gray-50 dark:bg-gray-950 p-4">
                    <MiniCalendar />
                    <EventList />
                </div>
            </div>
        </EventCalendarProvider>
    )
}

function EventCalendarFilter() {
    const {showMyEventsOnly, setShowMyEventsOnly} = useEventCalendar();

    return (
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
    )
}