"use client"

import Button from "@/components/ui/button/Button";
import { CalenderIcon, PencilIcon } from "@/icons";
import { useRouter } from "next/navigation";

interface EditEventButtonProps {
    eventId: string;
    minimal: boolean;
}

export default function EventActionButtons({ eventId, minimal }: EditEventButtonProps) {

    const router = useRouter();

    const handleEdit = () => {
        router.push(`${eventId}/edit`);
    }

    const handleToSignupPage = () => {
        router.push(`/p/events/tumbling-classes/register/${eventId}`);
    }

    return (
        <div className={"flex gap-1"}>
            <Button
                onClick={handleEdit}
                variant={"outline"}
            >
                <PencilIcon />
                <span className={minimal ? 'hidden' : ''}>
                    Bearbeiten
                </span>
            </Button>

            <Button
                onClick={handleToSignupPage}
                variant={"outline"}
            >
                <CalenderIcon />
                <span className={minimal ? 'hidden' : ''}>
                    Anmeldeseite
                </span>
            </Button>
        </div>
    )
}