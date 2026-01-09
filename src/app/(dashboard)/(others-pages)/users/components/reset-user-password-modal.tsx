import ComponentCard from "@/components/common/ComponentCard";
import Form from "@/components/form/Form";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { PasswordRequirements } from "@/components/users/PasswordRequirements";
import { EyeCloseIcon, EyeIcon, PencilIcon } from "@/icons";
import { resetPasswort } from "@/services/user-admin.api";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface ResetUserPasswordModalProps {
    userId: string;
}

export default function ResetUserPasswordModal({ userId }: ResetUserPasswordModalProps) {
    const router = useRouter();

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [newPassword, setNewPassword] = useState<string>("");
    const [isNewPasswordStrong, setIsNewPasswordStrong] = useState<boolean>(false);

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const closeModal = () => {
        setModalOpen(false)
    }

    const handleAction = async () => {
        setLoading(true);
        const error = await resetPasswort(userId, newPassword);
        setLoading(false);

        if (error) {
            setError("Es ist ein Fehler aufgetreten. " + error);
        } else {
            setModalOpen(false);
            router.refresh();
        }
    }

    return (
        <>
            <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => setModalOpen(true)}
            >
                <PencilIcon />
            </Button>

            <Modal
                isOpen={modalOpen}
                onClose={() => closeModal()}
            >
                <ComponentCard title={"Passwort ändern"}>
                    <Form onSubmit={handleAction}>
                        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-5 items-baseline md:align-baseline">
                            <Label>Neues Passwort</Label>
                            <div className="flex flex-col gap-1">
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Neues Passwort"
                                        defaultValue={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    ></Input>
                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                    >
                                        {showPassword ? (
                                            <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                                        ) : (
                                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                                        )}
                                    </span>
                                </div>

                                <PasswordRequirements
                                    password={newPassword}
                                    onValidationChange={setIsNewPasswordStrong}
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-error-500">
                                {error}
                            </p>
                        )}

                        <div>
                            <button
                                className="mt-4 inline-flex items-center justify-center font-medium gap-2 rounded-lg transition w-full bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-4 py-3 text-sm"
                                type="submit"
                                disabled={!isNewPasswordStrong || loading}
                            >
                                {loading ? 'Lädt...' : 'Passwort ändern'}
                            </button>
                        </div>
                    </Form>
                </ComponentCard>
            </Modal>
        </>
    )
}