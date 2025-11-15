"use client"

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import DeleteUserModal from "@/components/users/delete-user-modal";
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
                    <TableCell isHeader>
                        E-Mail
                    </TableCell>

                    <TableCell isHeader>
                        Rolle
                    </TableCell>

                    <TableCell isHeader>
                        Erstellt am
                    </TableCell>

                    <TableCell isHeader>
                        <></>
                    </TableCell>
                </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100">
                {users.map((user, index) => {
                    return (

                        <TableRow key={index}>
                            <TableCell
                                dataLabel={"E-Mail"}
                            >
                                <span>{user.email}</span>
                            </TableCell>

                            <TableCell
                                dataLabel={"Rolle"}
                            >
                                {user.role === "authenticated" ? 'Benutzer' : user.role === 'service_role'
                                    ? 'Admin'
                                    : user.role}
                            </TableCell>

                            <TableCell
                                dataLabel={"Erstellt am"}
                            >
                                {user.createdAt.toLocaleDateString("de-DE")}
                            </TableCell>

                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                <DeleteUserModal userId={user.id} />
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}