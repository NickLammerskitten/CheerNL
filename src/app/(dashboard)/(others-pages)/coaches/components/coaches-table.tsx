"use client"

import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/ui/table";
import React, {useState} from "react";
import {CoachListData} from "@/schemas/coach.schema";
import Search from "@/components/tables/Search";
import EditCoachModal from "@/app/(dashboard)/(others-pages)/coaches/components/edit-coach-modal";
import {TeamListData} from "@/schemas/team.schema";

interface CoachesTableProps {
    coaches: CoachListData[];
    teams: TeamListData[];
}

export default function CoachesTable({coaches, teams}: CoachesTableProps) {
    const [filteredCoaches, setFilteredCoaches] = useState(coaches);

    return (
        <div>
            <div className={"flex flex-col mb-1 sm:flex-row"}>
                <Search
                    objects={coaches}
                    searchableFields={["name", "teams.teamName"]}
                    onFilter={setFilteredCoaches}
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
                            Teams
                        </TableCell>

                        <TableCell
                            isHeader
                        >
                            Erstellt am
                        </TableCell>

                        <TableCell isHeader isActionHeader>
                            <></>
                        </TableCell>
                    </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {filteredCoaches.map((coach, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell dataLabel={"Name"}>
                                    {coach.name}
                                </TableCell>

                                <TableCell dataLabel={"Teams"}>
                                    {
                                        coach.teams.length > 0
                                            ? coach.teams
                                                .map((team) => team.teamName)
                                                .join(', ')
                                            : 'Keine'
                                    }
                                </TableCell>

                                <TableCell dataLabel={"Erstellt am"}>
                                    {coach.createdAt.toLocaleDateString("de-DE")}
                                </TableCell>

                                <TableCell>
                                    <EditCoachModal coach={coach} teams={teams}/>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>

            {filteredCoaches.length === 0 && (
                <p className={"text-gray-500 dark:text-gray-400"}>Keine Einträge vorhanden</p>
            )}
        </div>
    )
}