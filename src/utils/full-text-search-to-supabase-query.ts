export function fullTextSearchToSupabaseQuery(fullTextSearch: string) {
    return fullTextSearch
        .trim()
        .split(/\s+/)
        .map(term => `${term}:*`)
        .join(' & ');
}