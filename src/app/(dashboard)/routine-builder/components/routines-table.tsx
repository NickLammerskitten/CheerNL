"use client"

import { AddRoutineModal } from "@/app/(dashboard)/routine-builder/components/add-routine-modal";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { RoutineListData } from "@/schemas/routine.schema";
import { TeamListData } from "@/schemas/team.schema";
import React from "react";

interface RoutinesTableProps {
    routines: RoutineListData[];
    teams: TeamListData[];
}

export default function RoutinesTable({ routines, teams }: RoutinesTableProps) {

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

                                <TableCell>
                                    <></>
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