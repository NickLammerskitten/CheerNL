import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { EventSlotListData } from "@/schemas/event-slot.schema";
import { RecurrenceType } from "@/types/recurrence-type";
import { dayOfWeekToString } from "@/utils/day-of-week-to-string";
import { format } from "date-fns";

interface EventSlotsTableProps {
    slots: EventSlotListData[]
}

export default function EventSlotsTable({ slots }: EventSlotsTableProps) {

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableCell isHeader>
                            Titel
                        </TableCell>

                        <TableCell isHeader>
                            Ort
                        </TableCell>

                        <TableCell isHeader>
                            Art
                        </TableCell>

                        <TableCell isHeader>
                            Zeitpunkt
                        </TableCell>

                        <TableCell isHeader>
                            Coaches
                        </TableCell>

                        <TableCell isHeader>
                            Max Teilnehmer
                        </TableCell>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {slots.map((slot, index) =>
                        <TableRow key={index}>
                            <TableCell dataLabel={"Titel"}>
                                {slot.title ?? 'Kein Titel'}
                            </TableCell>

                            <TableCell dataLabel={"Ort"}>
                                {slot.location ?? 'Kein Ort'}
                            </TableCell>

                            <TableCell dataLabel={"Art"}>
                                {slot.recurrenceType === RecurrenceType.ONCE
                                    ? 'Einmalig'
                                    : slot.recurrenceType === RecurrenceType.WEEKLY
                                        ? 'Wöchentlich'
                                        : slot.recurrenceType}
                            </TableCell>

                            <SlotTimeTableCell slot={slot} />

                            <TableCell dataLabel={"Coaches"}>
                                {slot.coaches.length > 0
                                    ? slot.coaches.map((coach, index) => (
                                        <div key={index}>
                                            {coach.coachName}
                                        </div>
                                    ))
                                    : 'Keine Coaches'}
                            </TableCell>

                            <TableCell dataLabel={"Max Teilnehmer"}>
                                {slot.maxRegistrations ?? "Keine"}
                            </TableCell>

                        </TableRow>,
                    )}
                </TableBody>
            </Table>

            {slots.length === 0 && (
                <p className={"text-gray-500 dark:text-gray-400"}>Keine Einträge vorhanden</p>
            )}
        </>
    )
}

interface SlotTimeTableCellProps {
    slot: EventSlotListData;
}

function SlotTimeTableCell({ slot }: SlotTimeTableCellProps) {
    return (
        <TableCell dataLabel={"Zeitpunkt"}>
            {slot.recurrenceType === RecurrenceType.ONCE ? (
                <>
                    {format(slot.slotStart!, "dd.MM.yyyy HH:mm")} Uhr, {slot.durationMinutes} Minuten
                </>
            ) : slot.recurrenceType === RecurrenceType.WEEKLY ? (
                    <>
                        {slot.slotStart ? format(slot.slotStart, "dd.MM.yyyy") : ""}
                        {" - "}
                        {slot.slotEnd ? format(slot.slotEnd, "dd.MM.yyyy") : ""},<br />
                        {dayOfWeekToString(slot.dayOfWeek)} um {slot.startTime},<br />
                        {slot.durationMinutes} Minuten
                    </>
                )
                : (
                    <>Keine bekannte Art</>
                )}
        </TableCell>
    )
}