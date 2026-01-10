import Button from "@/components/ui/button/Button";
import {HorizontaLDots} from "@/icons";
import React, {useState} from "react";
import {Dropdown} from "@/components/ui/dropdown/Dropdown";
import {DropdownItem} from "@/components/ui/dropdown/DropdownItem";
import {EventRegistrationData} from "@/schemas/event-slot-registration.schema";
import DeleteEventRegistrationModal from "@/app/(dashboard)/actions/delete-event-registration-modal";

interface ParticipantRowActionsProps {
    participant: EventRegistrationData;
}

interface ModalStates {
    cancelEventRegistrationModal: boolean;
}

export default function ParticipantRowActions({participant}: ParticipantRowActionsProps) {
    const [isOpen, setIsOpen] = useState(false);

    const [modalStates, setModalStates] = useState<ModalStates>({
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
                <DropdownItem
                    onItemClick={() => openModal("cancelEventRegistrationModal")}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    Registrierung löschen
                </DropdownItem>
            </Dropdown>

            <DeleteEventRegistrationModal
                registrationId={participant.id}
                modalOpen={modalStates.cancelEventRegistrationModal}
                onClose={() => closeModal("cancelEventRegistrationModal")}
            />
        </div>
    );
}