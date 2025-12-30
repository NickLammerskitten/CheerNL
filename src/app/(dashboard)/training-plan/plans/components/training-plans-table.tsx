import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { TrainingPlanListData } from "@/schemas/training-plan.schema";
import { format } from "date-fns";
import React from "react";

interface TrainingPlanTableProps {
    trainingPlans: TrainingPlanListData;
}

export default function TrainingPlansTable({ trainingPlans }: TrainingPlanTableProps) {

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableCell isHeader>
                            Name
                        </TableCell>

                        <TableCell isHeader>
                            Erstellt am
                        </TableCell>
                    </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100">
                    {trainingPlans.map((trainingPlan, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell
                                    dataLabel={"Name"}
                                >
                                    {trainingPlan.name}
                                </TableCell>

                                <TableCell
                                    dataLabel={"Erstellt am"}
                                >
                                    {format(trainingPlan.createdAt, "dd.MM.yyyy HH:mm")}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>

            {trainingPlans.length === 0 && (
                <p className={"text-gray-500 dark:text-gray-400"}>Keine Einträge vorhanden</p>
            )}
        </>
    )
}