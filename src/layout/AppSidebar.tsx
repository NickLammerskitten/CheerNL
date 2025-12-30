"use client";
import { useSidebar } from "@/context/SidebarContext";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/auth-js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { CalenderIcon, GridIcon, GroupIcon, LockIcon, ShootingStarIcon, WeightliftingIcon } from "../icons";

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path: string;
    adminRoute?: boolean;
};

const navItems: NavItem[] = [
    {
        icon: <GridIcon />,
        name: "Dashboard",
        path: "/",
    },
    {
        icon: <CalenderIcon />,
        name: "Events",
        path: "/events",
    },
    {
        icon: <WeightliftingIcon />,
        name: "Kraft-/Ausdauertraining",
        path: "/training-plan"
    }
];

const othersItems: NavItem[] = [
    {
        icon: <GroupIcon />,
        name: "Teams",
        path: "/teams",
    },
    {
        icon: <ShootingStarIcon />,
        name: "Coaches",
        path: "/coaches",
    },
    {
        icon: <LockIcon />,
        name: "Benutzer",
        path: "/users",
        adminRoute: true,
    },
];

const AppSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const pathname = usePathname();

    const supabase = createClient();

    const [user, setUser] = useState<User>()

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        const user = await supabase.auth.getUser();

        if (user.data.user === null) {
            throw Error("Aktueller Benutzer nicht gefunden")
        }

        setUser(user.data.user)
    }

    const renderMenuItems = (
            navItems: NavItem[],
        ) => (
            <ul className="flex flex-col gap-4">
                {navItems.map((nav, index) =>
                    <div key={index}>
                        {nav.adminRoute && user?.role !== "service_role" ? <></> :
                            <li key={nav.name}>
                                <Link
                                    href={nav.path}
                                    className={`menu-item group ${
                                        isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                                    }`}
                                >
                                    <span
                                        className={`${
                                            isActive(nav.path)
                                                ? "menu-item-icon-active"
                                                : "menu-item-icon-inactive"
                                        }`}
                                    >
                                      {nav.icon}
                                    </span>

                                    {(isExpanded || isHovered || isMobileOpen) && (
                                        <span className={`menu-item-text`}>{nav.name}</span>
                                    )}
                                </Link>
                            </li>
                        }
                    </div>,
                )}
            </ul>
        )
    ;

    // const isActive = (path: string) => path === pathname;
    const isActive = useCallback((path: string) => path === pathname, [pathname]);

    return (
        <aside
            className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
                isExpanded || isMobileOpen
                    ? "w-[290px]"
                    : isHovered
                        ? "w-[290px]"
                        : "w-[90px]"
            }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
                <nav className="mb-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2
                                className={`mb-4 mt-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                                    !isExpanded && !isHovered
                                        ? "lg:justify-center"
                                        : "justify-start"
                                }`}
                            >
                                Menü
                            </h2>
                            {renderMenuItems(navItems)}
                        </div>

                        <div className="">
                            <h2
                                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                                    !isExpanded && !isHovered
                                        ? "lg:justify-center"
                                        : "justify-start"
                                }`}
                            >
                                Mein Verein
                            </h2>
                            {renderMenuItems(othersItems)}
                        </div>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default AppSidebar;
