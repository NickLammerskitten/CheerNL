import { createClient } from "@/utils/supabase/client";

export const fetchRulingStream = async (message: string): Promise<ReadableStream<Uint8Array> | null> => {
    const supabase = createClient();

    const { data: { session } } = await supabase.auth.getSession();

    const token = session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/ruling-classifier`;
    const response = await fetch(functionUrl, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ request: message }),
    });

    if (!response.ok) {
        throw new Error(`API Fehler: ${response.status}`);
    }

    return response.body;
};