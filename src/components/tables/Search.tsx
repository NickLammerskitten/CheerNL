"use client"

import Input from "@/components/form/input/InputField";
import {useEffect, useState} from "react";
import {genericSearch} from "@/utils/generic-search";

interface SearchProps <T>{
    objects: T[];
    searchableFields: string[];
    onFilter: (filteredObjects: T[]) => void;
}

export default function Search<T>({objects, searchableFields, onFilter}: SearchProps<T>) {
    const [searchString, setSearchString] = useState<string>("");

    useEffect(() => {
        if (searchString === "" || searchString === null) {
            onFilter(objects);
            return;
        }

        const searchResult = genericSearch(
            objects,
            searchString,
            searchableFields
        );

        onFilter(searchResult);
    }, [objects, searchString]);

    return (
        <Input
            onChange={(e) => setSearchString(e.target.value)}
            defaultValue={searchString}
            placeholder="Suche"
        />
    )
}