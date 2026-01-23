"use client";

import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { EyeIcon } from "@/icons";
import { TrainingPlanAthleteListData } from "@/schemas/training-plan-athlete.schema";
import { format } from "date-fns";
import {useRouter, useSearchParams} from "next/navigation";
import React from "react";
import Pagination from "@/components/tables/Pagination";

interface TrainingPlanAthletesTableProps {
    athletes: TrainingPlanAthleteListData;
    totalPages: number;
}

export default function TrainingPlanAthletesTable({ athletes, totalPages }: TrainingPlanAthletesTableProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentPage = Number(searchParams.get("page")) || 1;

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());

        router.push(`/training-plan?${params.toString()}`)
    };

    const openDetailPage = (id: string) => {
        router.push(`/training-plan/${id}`);
    }

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

                        <TableCell isHeader isActionHeader>
                            <></>
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

                                <TableCell
                                    dataLabel={""}
                                >
                                    <div className={"flex gap-1"}>

                                        <Button
                                            variant={"outline"}
                                            size={"sm"}
                                            onClick={() => openDetailPage(athlete.id)}
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

            {athletes.length === 0 && (
                <p className={"text-gray-500 dark:text-gray-400"}>Keine Einträge vorhanden</p>
            )}

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