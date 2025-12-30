"use client";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { TrainingPlanAthleteListData } from "@/schemas/training-plan-athlete.schema";
import { format } from "date-fns";
import React from "react";

interface TrainingPlanAthletesTableProps {
    athletes: TrainingPlanAthleteListData;
}

export default function TrainingPlanAthletesTable({ athletes }: TrainingPlanAthletesTableProps) {
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableCell isHeader>
                            Name
                        </TableCell>

                        <TableCell isHeader>
                            Trainingsplan
                        </TableCell>

                        <TableCell isHeader>
                            Erstellt am
                        </TableCell>
                    </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100">
                    {athletes.map((athlete, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell
                                    dataLabel={"Name"}
                                >
                                    {athlete.firstName + " " + athlete.lastName}
                                </TableCell>

                                <TableCell
                                    dataLabel={"Plan"}
                                >
                                    {athlete.trainingPlanName}
                                </TableCell>

                                <TableCell
                                    dataLabel={"Erstellt am"}
                                >
                                    {format(athlete.createdAt, "dd.MM.yyyy HH:mm")}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>

            {athletes.length === 0 && (
                <p className={"text-gray-500 dark:text-gray-400"}>Keine Einträge vorhanden</p>
            )}
        </>
    )
}