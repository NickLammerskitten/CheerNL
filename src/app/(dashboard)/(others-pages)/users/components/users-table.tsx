"use client"

import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/ui/table";
import DeleteUserModal from "@/app/(dashboard)/(others-pages)/users/components/delete-user-modal";
import ResetUserPasswordModal from "@/app/(dashboard)/(others-pages)/users/components/reset-user-password-modal";
import {UserListData} from "@/schemas/user.schema";
import React, {useState} from "react";
import {AddUserModal} from "@/app/(dashboard)/(others-pages)/users/components/add-user-modal";
import Search from "@/components/tables/Search";

interface UsersTableProps {
    users: UserListData
}

export default function UsersTable({users}: UsersTableProps) {
    const [filteredUsers, setFilteredUsers] = useState(users);

    return (
        <>
            <div className={"flex flex-col mb-1 gap-1 sm:flex-row sm:justify-between"}>
                <Search objects={users} searchableFields={["email", "displayName"]} onFilter={setFilteredUsers}/>
                <AddUserModal/>
            </div>

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

                        <TableCell isHeader isActionHeader>
                            <></>
                        </TableCell>
                    </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100">
                    {filteredUsers.map((user, index) => {
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
                                    <div className="flex flex-row gap-2">
                                        <ResetUserPasswordModal userId={user.id}/>
                                        <DeleteUserModal userId={user.id}/>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>

            {filteredUsers.length === 0 && (
                <p className={"text-gray-500 dark:text-gray-400"}>Keine Einträge vorhanden</p>
            )}
        </>
    )
}