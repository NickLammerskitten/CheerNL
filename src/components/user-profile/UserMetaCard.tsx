import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import React from "react";

export default async function UserMetaCard() {
    const supabase = await createClient()

    const { data: user } = await supabase.auth.getUser()

    return (
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                    <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                        <Image
                            width={80}
                            height={80}
                            src="/images/icons/avatar.svg"
                            alt="user"
                        />
                    </div>
                    <div className="order-3 xl:order-2">
                        <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                            {user.user?.email}
                        </h4>
                        <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {user.user?.role}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
