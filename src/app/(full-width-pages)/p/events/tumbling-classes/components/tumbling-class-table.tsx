"use client"

import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { CalenderIcon } from "@/icons";
import { EventPublicListData } from "@/schemas/event-public.schema";
import { useRouter } from "next/navigation";
import React from "react";

interface TumblingClassListItemProps {
    tumblingClasses: EventPublicListData[];
    anmeldungMoeglich: boolean;
}

export default function TumblingClassTable({ tumblingClasses, anmeldungMoeglich }: TumblingClassListItemProps) {
    const router = useRouter();

    const handleLogin = (id: string) => {
        router.push(`tumbling-classes/register/${id}`);
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableCell isHeader>
                        Titel
                    </TableCell>

                    <TableCell isHeader>
                        Registrierungszeitraum
                    </TableCell>
                </TableRow>
            </TableHeader>

            <TableBody>
                {tumblingClasses.map((tumblingClass) =>
                    <TableRow key={tumblingClass.id}>
                        <TableCell dataLabel={"Titel"}>
                            {tumblingClass.title}
                        </TableCell>

                        <TableCell dataLabel={"Registrierung"}>
                            {tumblingClass.registrationFrom.toLocaleString()} -
                            <br />
                            {tumblingClass.registrationTill.toLocaleString()}
                        </TableCell>

                        {anmeldungMoeglich &&
                            <TableCell dataLabel={""}>
                                <div className={"flex gap-1"}>
                                    <Button
                                        variant={"outline"}
                                        size={"sm"}
                                        onClick={() => handleLogin(tumblingClass.id)}
                                    >
                                        Anmelden <CalenderIcon />
                                    </Button>
                                </div>
                            </TableCell>
                        }
                    </TableRow>,
                )}
            </TableBody>

        </Table>
    )
}