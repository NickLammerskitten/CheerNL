"use client";
import React, { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Checkbox from "../form/input/Checkbox";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";

export default function SignInForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    return (
        <div className="flex flex-col flex-1 w-full">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Anmelden
                        </h1>
                    </div>
                    <form>
                        <div className="space-y-6">
                            <div>
                                <Label>
                                    Email <span className="text-error-500">*</span>{" "}
                                </Label>
                                <Input
                                    placeholder="info@gmail.com"
                                    type="email"
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
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    checked={isChecked}
                                    onChange={setIsChecked}
                                />
                                <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                                    Angemeldet bleiben?
                                </span>
                            </div>
                            <div>
                                <Button
                                    className="w-full"
                                    size="sm"
                                >
                                    Anmelden
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
