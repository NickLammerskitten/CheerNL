"use client"

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";
import { PasswordRequirements } from "@/components/users/PasswordRequirements";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { isPasswordStrong } from "@/utils/password-checker";
import { createClient } from "@/utils/supabase/client";
import React, { useState } from "react";

export default function ResetPassword() {
    const supabase = createClient();

    const [newPassword, setNewPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isNewPasswordStrong, setIsNewPasswordStrong] = useState<boolean>(false);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState<boolean>(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const passwordStrong = isPasswordStrong(newPassword);
        if (!passwordStrong) {
            setError("Das Passwort ist nicht stark genug.")
        }

        setLoading(true);

        const { error } = await supabase.auth.updateUser(
            {
                password: newPassword,
            },
        )

        setLoading(false);

        if (error) {
            setSuccess(false);
            setError("Es ist ein Fehler aufgetreten bei der Änderung des Passworts. " + error.message);
            return;
        }

        setSuccess(true);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-5 items-baseline md:align-baseline">
                <Label
                    htmlFor="newPassword"
                    className="dark:text-white/70"
                >Neues Passwort</Label>
                <div className="flex flex-col gap-1">
                    <div className="relative">
                        <Input
                            id="newPassword"
                            type={showPassword ? "text" : "password"}
                            defaultValue={newPassword}

                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Neues Passwort"
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
                        password={newPassword}
                        onValidationChange={setIsNewPasswordStrong}
                    />
                </div>
            </div>

            <div className={"mt-2"}>
                {error && (
                    <Alert
                        variant={"error"}
                        title={"Fehler"}
                        message={error}
                    ></Alert>
                )}

                {success && (
                    <Alert
                        variant={"success"}
                        title={"Erfolgreich"}
                        message={"Dein Passwort wurde erfolgreich geändert."}
                    ></Alert>
                )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <button
                    type="submit"
                    disabled={!isNewPasswordStrong || loading}
                    className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition w-full sm:w-auto bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-4 py-3 text-sm"
                >
                    {loading ? "Speichern..." : "Passwort ändern"}
                </button>
            </div>
        </form>
    )
}