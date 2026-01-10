import Button from "@/components/ui/button/Button";
import { HorizontaLDots } from "@/icons";
import React, { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { EventRegistrationData } from "@/schemas/event-slot-registration.schema";
import DeleteEventRegistrationModal from "@/app/(dashboard)/actions/delete-event-registration-modal";
import MoveFromWaitlistModal from "@/app/(dashboard)/actions/move-from-waitlist-modal";

interface ParticipantRowActionsProps {
    participant: EventRegistrationData;
}

interface ModalStates {
    moveFromWaitlistModal: boolean;
    cancelEventRegistrationModal: boolean;
}

export default function ParticipantRowActions({participant}: ParticipantRowActionsProps) {
    const [isOpen, setIsOpen] = useState(false);

    const [modalStates, setModalStates] = useState<ModalStates>({
        moveFromWaitlistModal: false,
        cancelEventRegistrationModal: false,
    });

    const closeDropdown = () => setIsOpen(false);
    const handleToggle = () => setIsOpen((prev) => !prev);

    const openModal = (type: keyof ModalStates) => {
        closeDropdown();

        setModalStates((prev) => ({
            ...prev,
            [type]: true,
        }));
    };

    const closeModal = (type: keyof ModalStates) => {
        setModalStates((prev) => ({
            ...prev,
            [type]: false,
        }));
    };

    return (
        <div className="inline-block text-left">
            <Button
                size={'sm'}
                variant={"outline"}
                onClick={handleToggle}
                className="dropdown-toggle"
            >
                <HorizontaLDots/>
            </Button>

            <Dropdown
                isOpen={isOpen}
                onClose={closeDropdown}
                className={"w-48"}
            >
                {participant.waitlist && (
                    <DropdownItem
                        onItemClick={() => openModal("moveFromWaitlistModal")}
                    >
                        Registrierung bestätigen
                    </DropdownItem>
                )}

                <DropdownItem
                    onItemClick={() => openModal("cancelEventRegistrationModal")}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    Registrierung löschen
                </DropdownItem>
            </Dropdown>

            <MoveFromWaitlistModal
                registration={participant}
                modalOpen={modalStates.moveFromWaitlistModal}
                onClose={() => closeModal("moveFromWaitlistModal")}
            />

            <DeleteEventRegistrationModal
                registration={participant}
                modalOpen={modalStates.cancelEventRegistrationModal}
                onClose={() => closeModal("cancelEventRegistrationModal")}
            />
        </div>
    );
}