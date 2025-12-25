"use client"

import Link from "next/link";
import React from "react";

export default function PublicPageLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <div className={"m-3 flex min-h-screen flex-col"}>
            <div className={"flex-1"}>
                {children}
            </div>

            <div className="mt-3 border-t pt-3 flex flex-col gap-4 divide-y md:flex-row md:items-start md:justify-between md:divide-y-0 md:gap-0">
                <div className="py-2 text-center md:text-left md:py-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} - CheerNL<br />
                        im Auftrag von SV Hembergen 1970 e.V.
                    </p>
                </div>

                <div className="flex flex-col py-2 text-center md:py-0">
                    <Link
                        href={"https://www.cle.sv-hembergen.de/willkommen"}
                        className="underline text-gray-500 hover:text-gray-600"
                        target={"_blank"}
                    >
                        Cheerleading
                    </Link>

                    <Link
                        href={"https://www.sv-hembergen.de/impressum"}
                        className="underline text-gray-500 hover:text-gray-600"
                        target={"_blank"}
                    >
                        Impressum
                    </Link>

                    <Link
                        href={"https://www.sv-hembergen.de/datenschutz"}
                        className="underline text-gray-500 hover:text-gray-600"
                        target={"_blank"}
                    >
                        Datenschutz
                    </Link>
                </div>

                <div className="py-2 text-center md:text-right md:py-0">
                    <Link
                        href={'/login'}
                        className="underline text-gray-500 hover:text-gray-600"
                    >
                        Zum Admin Login
                    </Link>
                </div>
            </div>
        </div>
    )
}