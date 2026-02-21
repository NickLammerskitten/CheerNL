import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { GoogleGenAI } from "npm:@google/genai"
import { rulingCcvd } from "./ruling-ccvd.ts";

const systemPrompt = {
    text: `Du bist ein hochpräziser und unbestechlicher Cheerleading Rule-Judge (Schiedsrichter). 
Deine einzige Wissensquelle ist das folgende offizielle Regelwerk. Nutze NIEMALS externes Wissen. 

HIER IST DAS REGELWERK:
---
${rulingCcvd}
---

Deine Aufgabe ist es, ein Cheerleading-Element anhand einer Textbeschreibung und des angegebenen Wettkampf-Levels auf seine Legalität zu prüfen.

Hier sind ein paar zusätzliche Informationen zum Sport:
- Level 0: Niedrigste, Level 7: Höchste.
- Tumbling: 
    - Unterscheide klar zwischen Running und Standing. Wenn du es nicht klar erkennen kannst, gib keine auskunft.
- Stunting:
    - "Free-Flipping release move": Element ohne Kontakt zu den Bases (Bspw. Salto/Rewind)
    - Flick Flack Up/Backhandspring Up: Tansition aus einer invertierten Position 

GEHE ZWINGEND NACH DIESEN 3 SCHRITTEN VOR UND GIB DEINE ANTWORT GENAU IN DIESER STRUKTUR AUS:

### Schritt 1: Lokalisierung im Regelwerk
Finde die exakte Stelle im angehängten Regelwerk. Suche AUSSCHLIESSLICH in der Sektion für das angegebene Level oder niedrigeren Leveln. Ignoriere Regeln aus höheren Leveln.

### Schritt 2: Regel-Extraktion
Zitiere oder paraphrasiere die exakte Regel. Nenne alle Bedingungen und Ausnahmen ("AUSSER...").

### Schritt 3: Finale Beurteilung
Gib ein klares, abschließendes Urteil ab. Beginne mit: **LEGAL**, **ILLEGAL** oder **DEDUCTION**.
Begründe dein Urteil in 1-2 Sätzen.`,
};

const generationConfig = {
    maxOutputTokens: 2048,
    temperature: 0.1,
    topP: 0.95,
    thinkingConfig: {
        thinkingLevel: "HIGH",
    },
    safetySettings: [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
    ],
    systemInstruction: {
        parts: [systemPrompt],
    },
};

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
            }
        })
    }

    try {
        const { request } = await req.json()

        const apiKey = Deno.env.get('GOOGLE_VERTEX_API_KEY');
        if (!apiKey) {
            console.error("FEHLER: GOOGLE_VERTEX_API_KEY fehlt!");
            return new Response(
                JSON.stringify({ error: "Missing API Key" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        const ai = new GoogleGenAI({ apiKey: apiKey })
        const model = 'gemini-3-flash-preview';

        const responseStream = await ai.models.generateContentStream({
            model: model,
            contents: [{ role: 'user', parts: [{ text: request }] }],
            config: generationConfig
        });

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of responseStream) {
                        if (chunk.text) {
                            controller.enqueue(encoder.encode(chunk.text));
                        }
                    }
                    controller.close();
                } catch (err) {
                    console.error("Stream Error:", err);
                    controller.error(err);
                }
            }
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "X-Content-Type-Options": "nosniff",
                "Access-Control-Allow-Origin": "*",
            },
        });

    } catch (error) {
        console.error("System Error:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
})
