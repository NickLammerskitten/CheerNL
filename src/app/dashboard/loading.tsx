import ComponentCard from "@/components/common/ComponentCard";
import React from "react";

export default function DashboardLoading() {

    return (
        <ComponentCard title={""}>
            <p className="text-gray-500 dark:text-gray-400">
                Lade ...
            </p>
        </ComponentCard>
    )
}