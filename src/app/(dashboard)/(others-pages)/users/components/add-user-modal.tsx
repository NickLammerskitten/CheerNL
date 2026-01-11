"use client"

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal/Modal";
import { PasswordRequirements } from "@/components/users/PasswordRequirements";
import {EyeCloseIcon, EyeIcon, PlusIcon} from "@/icons";
import { createUser } from "@/services/user-admin.api";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export function AddUserModal() {
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false)

    const [displayName, setDisplayName] = useState<string | undefined>(undefined);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isPasswordStrong, setIsPasswordStrong] = useState<boolean>(false)
    const [isCoach, setIsCoach] = useState<boolean>(false);

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);

    const onClose = () => {
        setIsOpen(false)
    }

    const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const error = await createUser(email, password, displayName, isCoach);

        setLoading(false);

        if (error) {
            console.error(error);
            setError("Es gab einen Fehler bei der Registrierung des Benutzers. " + error);
        } else {
            setIsOpen(false);

            router.refresh();
        }
    }

    return (
        <>
            <Button
                variant={"outline"}
                onClick={() => setIsOpen(true)}
                startIcon={<PlusIcon />}
            >
                Benutzer hinzufügen
            </Button>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
            >
                <div>
                    <div className="px-6 py-5">
                        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                            Benutzer hinzufügen
                        </h3>

                        <form onSubmit={handleCreateUser}>
                            <div className="space-y-6">
                                <div>
                                    <Label>
                                        Name
                                    </Label>
                                    <Input
                                        placeholder="Max Mustermann"
                                        type="Name"
                                        onChange={(e) => setDisplayName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label>
                                        Email <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <Input
                                        placeholder="info@gmail.com"
                                        type="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>
                                        Passwort <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <div className="flex flex-col gap-1">
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
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
                                            password={password}
                                            onValidationChange={setIsPasswordStrong}
                                        />
                                    </div>

                                    <div className={"mt-5"}>
                                        <Checkbox
                                            label={"Ist Coach"}
                                            checked={isCoach}
                                            onChange={setIsCoach}
                                        />
                                    </div>
                                </div>

                                {/* Fehlermeldung anzeigen, falls vorhanden */}
                                {error && (
                                    <p className="text-sm text-error-500">
                                        {error}
                                    </p>
                                )}

                                <div>
                                    <button
                                        className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition w-full bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-4 py-3 text-sm"
                                        type="submit"
                                        disabled={!isPasswordStrong || loading}
                                    >
                                        {loading ? 'Lädt...' : 'Benutzer hinzufügen'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </>
    )
}