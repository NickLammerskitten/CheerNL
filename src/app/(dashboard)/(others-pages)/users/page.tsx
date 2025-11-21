import ComponentCard from "@/components/common/ComponentCard";
import { AddUserModal } from "@/components/users/add-user-modal";
import UsersTable from "@/components/users/users-table";
import { fetchAllUsers } from "@/services/user.api";
import React from "react";

export default async function UsersPage() {
    const users = await fetchAllUsers();

    return (
        <ComponentCard title={"Teams"}>
            <AddUserModal/>

            <UsersTable users={users}/>
        </ComponentCard>
    )
}