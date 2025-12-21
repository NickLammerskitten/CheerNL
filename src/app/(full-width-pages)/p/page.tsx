"use client"

import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";

export default function PublicPage() {
    const router = useRouter();

    return (
        <ComponentCard
            title={"Willkommen bei CLE"}
        >
            <div className={"flex flex-col gap-3"}>
                <p className={"dark:text-white/90"}>
                    Hier kannst du deine Anmeldungen zu den Tumbling Classes verwalten.
                </p>

                <div className={"flex flex-col sm:items-baseline"}>
                    <Button
                        variant={"primary"}
                        onClick={() => router.push('/p/events/tumbling-classes')}
                    >
                        Zu den Classes
                    </Button>
                </div>
            </div>
        </ComponentCard>

    )
}