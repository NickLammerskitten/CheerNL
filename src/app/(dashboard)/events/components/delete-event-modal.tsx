"use client"

import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal/Modal";
import { TrashBinIcon } from "@/icons";
import { deleteEvent } from "@/services/event.api";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface DeleteEventModelProps {
    eventId: string;
}

export default function DeleteEventModal({ eventId }: DeleteEventModelProps) {
    const router = useRouter();

    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
    }

    const handleDeleteEvent = async () => {
        await deleteEvent(eventId);

        setDeleteModalOpen(false);
        router.refresh();
    }

    return (
        <>
            <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => setDeleteModalOpen(true)}
            >
                <TrashBinIcon />
            </Button>

            <Modal
                isOpen={deleteModalOpen}
                onClose={() => closeDeleteModal()}
            >
                <ComponentCard title={"Event wirklich löschen?"}>
                    <p>
                        Möchtest du das Event wirklich löschen? Diese Aktion ist unwiderruflich und löscht auch alle
                        dazugehörigen Anmeldungen.
                    </p>

                    <div className={"flex flex-col items-end"}>
                        <Button
                            onClick={handleDeleteEvent}
                            className={"fc-bg-danger"}
                        >
                            Event löschen
                        </Button>
                    </div>
                </ComponentCard>
            </Modal>
        </>
    )
}