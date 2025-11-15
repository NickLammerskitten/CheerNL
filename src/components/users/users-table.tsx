import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { UserListData } from "@/schemas/user.schema";
import React from "react";

interface UsersTableProps {
    users: UserListData
}

export default function UsersTable({ users }: UsersTableProps) {

    return (
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
    )
}