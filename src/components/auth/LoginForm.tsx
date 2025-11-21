"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Input from "../form/input/InputField";
import Label from "../form/Label";

export default function LoginForm() {
    const supabase = createClient();
    const router = useRouter();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            console.error(error);
            setError("E-Mail oder Passwort ist ungültig."); // Setze eine nutzerfreundliche Fehlermeldung
        } else {
            router.push('/');
        }
    };

    return (
        <div className="flex flex-col flex-1 w-full">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Anmelden
                        </h1>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="space-y-6">
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
                                    Password <span className="text-error-500">*</span>{" "}
                                </Label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        onChange={(e) => setPassword(e.target.value)} // State bei Änderung aktualisieren
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
                                >
                                    Anmelden
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}