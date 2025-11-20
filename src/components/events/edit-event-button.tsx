"use client"

import Button from "@/components/ui/button/Button";
import { PencilIcon } from "@/icons";
import { useRouter } from "next/navigation";

interface EditEventButtonProps {
    eventId: string;
    minimal: boolean;
}

export default function EditEventButton({ eventId, minimal }: EditEventButtonProps) {

    const router = useRouter();

    const handleEdit = () => {
        router.push(`${eventId}/edit`);
    }

    return (
        <Button
            onClick={handleEdit}
            variant={"outline"}
        >
            <PencilIcon />
            <span className={minimal ? 'hidden' : ''}>
                Bearbeiten
            </span>
        </Button>
    )
}