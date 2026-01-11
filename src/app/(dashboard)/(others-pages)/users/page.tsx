import ComponentCard from "@/components/common/ComponentCard";
import UsersTable from "@/app/(dashboard)/(others-pages)/users/components/users-table";
import { fetchAllUsers } from "@/services/user-admin.api";
import React from "react";

export default async function UsersPage() {
    const users = await fetchAllUsers();

    return (
        <ComponentCard title={"Benutzer"}>
            <UsersTable users={users} />
        </ComponentCard>
    )
}