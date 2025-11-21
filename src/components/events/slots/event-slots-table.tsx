import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { EventSlotListData, RecurrenceType } from "@/schemas/event-slot.schema";
import { dayOfWeekToString } from "@/utils/day-of-week-to-string";

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
                            Dauer
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

                            <TableCell dataLabel={"Dauer"}>
                                {slot.durationMinutes} Minuten
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
                    {slot.slotStart?.toLocaleDateString()}
                </>
            ) : slot.recurrenceType === RecurrenceType.WEEKLY ? (
                    <>
                        {dayOfWeekToString(slot.dayOfWeek)} um {slot.startTime}
                    </>
                )
                : (
                    <>Keine bekannte Art</>
                )}
        </TableCell>
    )
}