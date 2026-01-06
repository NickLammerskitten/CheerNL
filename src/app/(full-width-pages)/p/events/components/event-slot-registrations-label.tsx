"use client";

interface EventSlotRegistrationLabelProps {
    maxRegistrations: number | null;
    registrationCount: number;
}

export default function EventSlotRegistrationsLabel({
    maxRegistrations,
    registrationCount,
}: EventSlotRegistrationLabelProps) {
    if (!maxRegistrations) {
        return (
            <span>
                Teilnehmer: Unbegrenzt
            </span>
        )
    }

    const currentCount = registrationCount || 0;

    const displayCount = currentCount > maxRegistrations
        ? maxRegistrations
        : currentCount;

    const waitingListCount = currentCount > maxRegistrations
        ? currentCount - maxRegistrations
        : 0;

    const isFull = currentCount >= maxRegistrations;

    return (
        <span>
            Teilnehmer: {displayCount} von {maxRegistrations}

            {isFull ? (
                <>
                    {' (Ausgebucht'}
                    {waitingListCount > 0 && `, ${waitingListCount} auf Warteliste`}
                    {')'}
                </>
            ) : (
                <>
                    {` (${maxRegistrations - currentCount} frei)`}
                </>
            )}
        </span>
    )
}