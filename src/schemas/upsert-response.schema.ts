export interface UpsertResponseSchema {
    success: boolean;
    id: string | null;
    error: string | null;
}