import { useRouter } from "next/navigation";
import React, {useState} from "react";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal/Modal";
import ComponentCard from "@/components/common/ComponentCard";
import deleteEventRegistration from "@/services/event-registration.api";
import {useEventCalendar} from "@/app/(dashboard)/context/useEventCalendar";

interface CancelEventRegistrationModalProps {
    registrationId: string;
    modalOpen: boolean;
    onClose: () => void;
}

export default function DeleteEventRegistrationModal({registrationId, modalOpen, onClose}: CancelEventRegistrationModalProps) {
    const { refreshData } = useEventCalendar();

    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleAction = async () => {
        setLoading(true);
        setError(null);
        try {
            await deleteEventRegistration(registrationId);

            onClose();

            router.refresh();
            refreshData();

            // @ts-expect-error: No specific error type
        } catch (e: Error) {
            console.error(e);
            setError("Es ist ein Fehler aufgetreten: " + (e.message || "Unbekannter Fehler"));
        } finally {
            setLoading(false);
        }
    }

    const closeModal = () => {
        onClose();
    }

    return (
        <Modal isOpen={modalOpen} onClose={closeModal}>
            <ComponentCard title={"Registrierung wirklich löschen?"}>
                <p>
                    Möchstest du die Registrierung wirklich löschen? Diese Aktion ist unwiderruflich.
                </p>

                {error && (
                    <p className="text-sm text-error-500">
                        {error}
                    </p>
                )}

                <div className={"flex flex-col items-end"}>
                    <Button onClick={handleAction}>
                        {loading ? 'Lädt...' : 'Registrierung löschen'}
                    </Button>
                </div>
            </ComponentCard>
        </Modal>
    )
}