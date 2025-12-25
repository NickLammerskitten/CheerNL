import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { TrashBinIcon } from "@/icons";
import { deleteUser } from "@/services/user-admin.api";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface DeleteUserModelProps {
    userId: string;
}

export default function DeleteUserModal({ userId }: DeleteUserModelProps) {
    const router = useRouter();

    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
    }

    const handleDeleteUser = async () => {
        const error = await deleteUser(userId);

        if (error) {
            console.error(error);
        } else {
            setDeleteModalOpen(false);
            router.refresh();
        }
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
                <ComponentCard title={"Benutzer wirklich löschen?"}>
                    <p>
                        Möchtest du den Benutzer wirklich löschen? Diese Aktion ist unwiderruflich und löscht alle Daten
                        in Abhängigkeit zu dem Benutzer
                    </p>

                    <div className={"flex flex-col items-end"}>
                        <Button
                            onClick={handleDeleteUser}
                            className={"fc-bg-danger"}
                        >
                            Benutzer löschen
                        </Button>
                    </div>
                </ComponentCard>
            </Modal>
        </>
    )
}