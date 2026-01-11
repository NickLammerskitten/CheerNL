const isObject = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null;
};

/**
 * path: in depth paths separated with a dot (.)
 **/
const getValuesFromPath = <T>(obj: T, path: string): string[] => {
    const parts = path.split('.');

    let currentValues: unknown[] = [obj];

    for (const part of parts) {
        currentValues = currentValues
            .flatMap(val => {
                if (isObject(val)) {
                    if (Array.isArray(val[part])) {
                        return val[part] as unknown[];
                    }

                    return val[part];
                }
                return [];
            })
            .filter(val => val !== null && val !== undefined);
    }

    return currentValues.map(val => String(val));
};

export const genericSearch = <T>(
    items: T[],
    query: string,
    properties: string[]
): T[] => {
    if (!query) return items;

    const searchString = query.toLowerCase();

    return items.filter(item => {
        return properties.some(path => {
            const values = getValuesFromPath(item, path);
            return values.some(val => val.toLowerCase().includes(searchString));
        });
    });
};
