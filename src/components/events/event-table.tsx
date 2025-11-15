"use client"

import Pagination from "@/components/tables/Pagination";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { EventListData } from "@/schemas/event.schema";
import { useRouter, useSearchParams } from "next/navigation";

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

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableCell isHeader>
                            Titel
                        </TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialEvents.map((event, index) =>
                        <TableRow key={index}>
                            <TableCell dataLabel={"Titel"}>
                                {event.title}
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