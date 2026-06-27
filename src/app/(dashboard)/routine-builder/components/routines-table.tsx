"use client"

import DeleteEventModal from "@/app/(dashboard)/events/components/delete-event-modal";
import { AddRoutineModal } from "@/app/(dashboard)/routine-builder/components/add-routine-modal";
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { EyeIcon } from "@/icons";
import { RoutineListData } from "@/schemas/routine.schema";
import { TeamListData } from "@/schemas/team.schema";
import { useRouter } from "next/navigation";
import React from "react";

interface RoutinesTableProps {
    routines: RoutineListData[];
    teams: TeamListData[];
}

export default function RoutinesTable({ routines, teams }: RoutinesTableProps) {
    const router = useRouter();

    const handleView = (id: string) => {
        router.push(`/routine-builder/${id}`)
    }

    return (
        <>
            <div className={"flex flex-col mb-1 gap-1 sm:flex-row sm:justify-between"}>
                <AddRoutineModal teams={teams} />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableCell isHeader>Name</TableCell>

                        <TableCell
                            isHeader
                        >
                            Team
                        </TableCell>

                        <TableCell
                            isHeader
                        >
                            Erstellt am
                        </TableCell>

                        <TableCell
                            isHeader
                            isActionHeader
                        >
                            <></>
                        </TableCell>
                    </TableRow>

                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {routines.map((routine, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell dataLabel={"Name"}>
                                    {routine.name}
                                </TableCell>

                                <TableCell dataLabel={"Team"}>
                                    {routine.team?.name ?? 'Kein Team'}
                                </TableCell>

                                <TableCell dataLabel={"Erstellt am"}>
                                    {routine.createdAt.toLocaleDateString("de-DE")}
                                </TableCell>

                                <TableCell dataLabel={""}>
                                    <div className={"flex gap-1"}>
                                        <Button
                                            variant={"outline"}
                                            size={"sm"}
                                            onClick={() => handleView(routine.id)}
                                        >
                                            <EyeIcon />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>

            {routines.length === 0 && (
                <p className={"text-gray-500 dark:text-gray-400"}>Keine Einträge vorhanden</p>
            )}
        </>
    )
}