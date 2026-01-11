"use client"

import {TeamListData} from "@/schemas/team.schema";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/ui/table";
import React, {useState} from "react";
import Search from "@/components/tables/Search";

interface TeamsTableProps {
    teams: TeamListData[];
}

export default function TeamsTable({ teams }: TeamsTableProps) {
    const [filteredTeams, setFilteredTeams] = useState(teams);

    return (
        <>
            <div className={"flex flex-col mb-1 sm:flex-row"}>
                <Search
                    objects={teams}
                    searchableFields={["name"]}
                    onFilter={setFilteredTeams}
                />
            </div>

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
                    {filteredTeams.map((team, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell dataLabel={"Team"}>
                                    {team.name}
                                </TableCell>

                                <TableCell dataLabel={"Erstellt am"}>
                                    {team.createdAt.toLocaleDateString("de-DE")}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>

            {filteredTeams.length === 0 && (
                <p className={"text-gray-500 dark:text-gray-400"}>Keine Einträge vorhanden</p>
            )}
        </>
    )
}