export const fetchRulingStream = async (message: string): Promise<ReadableStream<Uint8Array> | null> => {
    const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
    });

    if (!response.ok) {
        throw new Error(`API Fehler: ${response.status}`);
    }

    return response.body;
};