import ComponentCard from "@/components/common/ComponentCard";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { fetchCoachList } from "@/services/coach.api";
import React from "react";

export default async function Coaches() {
    const coaches = await fetchCoachList()

    return (
        <ComponentCard title={"Coaches"}>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableCell
                            isHeader
                        >
                            Name
                        </TableCell>

                        <TableCell
                            isHeader
                        >
                            Teams
                        </TableCell>

                        <TableCell
                            isHeader
                        >
                            Erstellt am
                        </TableCell>
                    </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {coaches.map((coach, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell dataLabel={"Name"}>
                                    {coach.name}
                                </TableCell>

                                <TableCell dataLabel={"Teams"}>
                                    {
                                        coach.teams
                                            .map((team) => team.teamName)
                                            .join(', ')
                                    }
                                </TableCell>

                                <TableCell dataLabel={"Erstellt am"}>
                                    {coach.createdAt.toLocaleDateString("de-DE")}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </ComponentCard>
    )
}