import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { fetchTeamList } from "@/services/team.api";
import React from "react";

export default async function Teams() {
    const teams = await fetchTeamList()

    return (
        <div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                    Teams
                </h3>
                <div className="space-y-6">

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Name
                                </TableCell>

                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Erstellt am
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {teams.map((team, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            {team.name}
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {team.createdAt.toLocaleDateString("de-DE")}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}