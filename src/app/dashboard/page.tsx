import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title:
        "CLE - Dashboard",
    description: "CLE Vereinsverwaltung - Dashboard",
};

export default function Dashboard() {
    return (
        <div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                    Übersicht
                </h3>
                <div className="space-y-6">
                </div>
            </div>
        </div>
    );
}
