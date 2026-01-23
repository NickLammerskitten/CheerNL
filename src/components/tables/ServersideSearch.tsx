"use client"

import Input from "@/components/form/input/InputField";
import {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";

interface ServersideSearchProps {
    searchParamName?: string;
    placeholder?: string;
    debounceMs?: number;
}

export default function ServersideSearch({
                                             searchParamName = "search",
                                             placeholder = "Suche",
                                             debounceMs = 500
                                         }: ServersideSearchProps) {

    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchString, setSearchString] = useState<string>(
        searchParams.get(searchParamName) ?? ""
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());

            if (searchString) {
                params.set(searchParamName, searchString);
                params.set("page", "1");
            } else {
                params.delete(searchParamName);
            }

            router.push(`?${params.toString()}`);
        }, debounceMs);

        return () => clearTimeout(timeoutId);
    }, [searchString, searchParams, searchParamName, router, debounceMs]);

    return (
        <Input
            onChange={(e) => setSearchString(e.target.value)}
            defaultValue={searchString}
            placeholder={placeholder}
        />
    )

}