import ComponentCard from "@/components/common/ComponentCard";
import { AddUserModal } from "@/components/users/add-user-modal";
import UsersTable from "@/components/users/users-table";
import { fetchAllUsers } from "@/services/user-admin.api";
import React from "react";

export default async function UsersPage() {
    const users = await fetchAllUsers();

    return (
        <ComponentCard title={"Benutzer"}>
            <AddUserModal/>

            <UsersTable users={users}/>
        </ComponentCard>
    )
}