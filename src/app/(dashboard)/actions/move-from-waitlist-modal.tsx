import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import {Modal} from "@/components/ui/modal/Modal";
import ComponentCard from "@/components/common/ComponentCard";
import { moveRegistrationFromWaitlist } from "@/services/event-registration.api";
import { useEventCalendar } from "@/app/(dashboard)/context/useEventCalendar";
import { EventRegistrationData } from "@/schemas/event-slot-registration.schema";
import Alert from "@/components/ui/alert/Alert";

interface CancelEventRegistrationModalProps {
    registration: EventRegistrationData;
    modalOpen: boolean;
    onClose: () => void;
}

export default function MoveFromWaitlistModal({registration, modalOpen, onClose}: CancelEventRegistrationModalProps) {
    const { refreshData } = useEventCalendar();

    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleAction = async () => {
        setLoading(true);
        setError(null);

        const response = await moveRegistrationFromWaitlist(registration.id);
        setLoading(false);

        if (!response.success) {
            setError(response.error);
            return;
        }

        onClose();
        router.refresh();
        refreshData();
    }

    const closeModal = () => {
        setLoading(false);
        setError(null);
        onClose();
    }

    return (
        <Modal isOpen={modalOpen} onClose={closeModal}>
            <ComponentCard title={"Registrierung bestätigen?"}>
                <p>
                    Hiermit wird die Registrierung von <b>{registration.firstName + " " + registration.lastName}</b> von
                    der Warteliste auf die bestätigen Registrierungen verschoben.<br/>

                    Achtung: Die Person wird <b>nicht</b> automatisch informiert.
                </p>

                {error && (
                    <Alert
                        variant={"error"}
                        title={"Fehler"}
                        message={error}
                    ></Alert>
                )}

                <div className={"flex flex-col items-end"}>
                    <Button onClick={handleAction}>
                        {loading ? 'Lädt...' : 'Registrierung bestätigen'}
                    </Button>
                </div>
            </ComponentCard>
        </Modal>
    )
}