"use client";
import type React from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

interface DropdownProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
    isOpen,
    onClose,
    children,
    className = "",
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isPositionTop, setIsPositionTop] = useState(false);

    useLayoutEffect(() => {
        if (isOpen && dropdownRef.current) {
            const dropdownRect = dropdownRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight - 32;

            if (dropdownRect.bottom > viewportHeight) {
                setIsPositionTop(true);
            } else {
                setIsPositionTop(false);
            }
        } else if (!isOpen) {
            setIsPositionTop(false);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !(event.target as HTMLElement).closest('.dropdown-toggle')
            ) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    if (!isOpen) {
        return null;
    }

    const positionClasses = isPositionTop
        ? "bottom-full mb-2 origin-bottom-right"
        : "mt-2 origin-top-right";

    return (
        <div
            ref={dropdownRef}
            className={`absolute z-40 right-0 rounded-xl border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark ${positionClasses} ${className}`}
        >
            {children}
        </div>
    );
};