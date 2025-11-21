"use client"

import DeleteEventModal from "@/components/events/delete-event-modal";
import Pagination from "@/components/tables/Pagination";
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { EyeIcon } from "@/icons";
import { EventListData, EventType } from "@/schemas/event.schema";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface EventTableProps {
    initialEvents: EventListData[];
    totalPages: number;
}

export default function EventTable({ initialEvents, totalPages }: EventTableProps) {

    const router = useRouter();
    const searchParams = useSearchParams();

    const currentPage = Number(searchParams.get("page")) || 1;

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());

        router.push(`/dashboard/events?${params.toString()}`)
    };

    const handleCreate = () => {
        router.push('/dashboard/events/create')
    }

    const handleView = (id: string) => {
        router.push(`/dashboard/events/${id}`)
    }

    return (
        <>
            <Button
                variant={"outline"}
                onClick={() => handleCreate()}
            >
                Event erstellen
            </Button>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableCell isHeader>
                            Titel
                        </TableCell>
                        <TableCell isHeader>
                            Typ
                        </TableCell>
                        <TableCell isHeader>
                            Registrierungszeitraum
                        </TableCell>
                        <TableCell isHeader>
                            Erstellt am
                        </TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialEvents.map((event, index) =>
                        <TableRow key={index}>
                            <TableCell dataLabel={"Titel"}>
                                {event.title}
                            </TableCell>
                            <TableCell dataLabel={"Typ"}>
                                {event.type === EventType.TUMBLINGClASS ? 'Tumbling Class' : event.type}
                            </TableCell>
                            <TableCell dataLabel={"Registrierung"}>
                                {event.registrationFrom.toLocaleString()} -
                                <br />
                                {event.registrationTill.toLocaleString()}
                            </TableCell>
                            <TableCell dataLabel={"Erstellt am"}>
                                {event.createdAt.toLocaleString()}
                            </TableCell>
                            <TableCell dataLabel={""}>
                                <div className={"flex gap-1"}>
                                    <Button
                                        variant={"outline"}
                                        size={"sm"}
                                        onClick={() => handleView(event.id)}
                                    >
                                        <EyeIcon />
                                    </Button>

                                    <DeleteEventModal eventId={event.id} />
                                </div>
                            </TableCell>
                        </TableRow>,
                    )}
                </TableBody>
            </Table>

            <div className={"flex flex-col items-center"}>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    )
}