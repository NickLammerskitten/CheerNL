import ComponentCard from "@/components/common/ComponentCard";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { fetchAllUsers } from "@/services/user.api";
import React from "react";

export default async function UsersPage() {

    const users = await fetchAllUsers();

    return (
        <ComponentCard title={"Teams"}>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                            Id
                        </TableCell>

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
                            E-Mail
                        </TableCell>

                        <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                            Rolle
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
                    {users.map((user, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {user.id}
                                </TableCell>

                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {user.displayName}
                                </TableCell>

                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {user.email}
                                </TableCell>

                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {user.role}
                                </TableCell>

                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {user.createdAt.toLocaleDateString("de-DE")}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </ComponentCard>
    )
}