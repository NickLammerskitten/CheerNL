import ComponentCard from "@/components/common/ComponentCard";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { fetchTeamList } from "@/services/team.api";
import React from "react";

export default async function Teams() {
    const teams = await fetchTeamList()

    return (
        <ComponentCard title={"Teams"}>
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
                            Erstellt am
                        </TableCell>
                    </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {teams.map((team, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell>
                                    {team.name}
                                </TableCell>

                                <TableCell>
                                    {team.createdAt.toLocaleDateString("de-DE")}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </ComponentCard>
    )
}