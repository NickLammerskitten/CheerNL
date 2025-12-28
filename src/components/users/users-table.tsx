"use client"

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import DeleteUserModal from "@/components/users/delete-user-modal";
import ResetUserPasswordModal from "@/components/users/reset-user-password-modal";
import { UserListData } from "@/schemas/user.schema";
import React from "react";

interface UsersTableProps {
    users: UserListData
}

export default function UsersTable({ users }: UsersTableProps) {

    console.log(users);
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableCell isHeader>
                        Name
                    </TableCell>

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
                                dataLabel={"Name"}
                            >
                                {user.displayName ?? "Unbekannt"}
                            </TableCell>

                            <TableCell
                                dataLabel={"E-Mail"}
                            >
                                <span>{user.email} {!user.emailVerified && '(Nicht verifiziert)'}</span>
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
                                <ResetUserPasswordModal userId={user.id} />
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}