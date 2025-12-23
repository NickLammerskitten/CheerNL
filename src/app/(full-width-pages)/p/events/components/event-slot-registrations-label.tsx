"use client";

import { fetchEventRegistrationCount } from "@/services/event-registration-public.api";
import { useEffect, useState } from "react";

interface EventSlotRegistrationLabelProps {
    eventSlotId: string;
    maxRegistrations: number | null;
}

export default function EventSlotRegistrationsLabel({
    eventSlotId,
    maxRegistrations,
}: EventSlotRegistrationLabelProps) {

    const [registrationCount, setRegistrationCount] = useState<number | null>();
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const loadRegistrationCount = async () => {
            setLoading(true);
            const count = await fetchEventRegistrationCount(eventSlotId);
            setRegistrationCount(count)
            setLoading(false);
        }

        loadRegistrationCount()
    }, [eventSlotId]);

    return (
        <span>
            Teilnehmer: {loading ? '?' : registrationCount} {maxRegistrations && ` von ${maxRegistrations}`}

            {registrationCount && maxRegistrations && registrationCount >= maxRegistrations ? (
                <>
                    {' (Ausgebucht)'}
                </>
            ) : registrationCount && maxRegistrations ? (
                <>
                    {` (${maxRegistrations - registrationCount} frei)`}
                </>
            ) : ''}
        </span>
    )
}