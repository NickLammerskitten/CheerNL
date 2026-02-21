import { File as GoogleFile } from "@google/genai"

export const fetchRulingStream = async (
    message: string,
    video: GoogleFile | null,
): Promise<ReadableStream<Uint8Array> | null> => {
    const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, video }),
    });

    if (!response.ok) {
        throw new Error(`API Fehler: ${response.status}`);
    }

    return response.body;
};