import { CheckLineIcon, CloseLineIcon } from "@/icons";
import React from 'react';

interface PasswordRequirementsProps {
    password: string;
    onValidationChange?: (isValid: boolean) => void;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password, onValidationChange }) => {
    // Definition der Regeln
    const requirements = [
        { label: "Mindestens 10 Zeichen", met: password.length >= 10 },
        { label: "Ein Großbuchstabe", met: /[A-Z]/.test(password) },
        { label: "Ein Kleinbuchstabe", met: /[a-z]/.test(password) },
        { label: "Eine Zahl", met: /\d/.test(password) },
        { label: "Ein Sonderzeichen", met: /[\W_]/.test(password) },
    ];

    const allMet = requirements.every((req) => req.met);

    React.useEffect(() => {
        if (onValidationChange) {
            onValidationChange(allMet);
        }
    }, [allMet, onValidationChange]);

    return (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                Sicherheit: {allMet ? <span className="text-green-600">Stark</span> : "Zu schwach"}
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
                {requirements.map((req, index) => (
                    <RequirementItem key={index} label={req.label} met={req.met} />
                ))}
            </ul>
        </div>
    );
};

interface RequirementProps {
    label: string;
    met: boolean;
}

const RequirementItem: React.FC<RequirementProps> = ({ label, met }) => (
    <li className={`flex items-center text-xs transition-colors duration-200 ${met ? 'text-green-600' : 'text-gray-400'}`}>
        {met ? <CheckLineIcon /> : <CloseLineIcon />}
        <span className={met ? 'font-medium' : ''}>{label}</span>
    </li>
);
