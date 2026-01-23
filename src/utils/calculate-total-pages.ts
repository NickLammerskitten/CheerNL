export const calculateTotalPages = (pageSize: number, totalCount: number | null) => {
    return totalCount === 0 || !totalCount
        ? 1
        : Math.ceil(totalCount / pageSize);
}