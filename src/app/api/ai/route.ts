import { systemPrompt } from "@/utils/ai-ruling/system-message";
import { createGoogleAiClient } from "@/utils/google/googel-ai-client";
import {
    ContentListUnion,
    createPartFromUri,
    GenerateContentConfig,
    GoogleGenAI,
    HarmBlockThreshold,
    HarmCategory,
    ThinkingLevel,
} from "@google/genai";
import { NextResponse } from 'next/server';

const generationConfig: GenerateContentConfig = {
    maxOutputTokens: 2048,
    temperature: 0.1,
    topP: 0.95,
    thinkingConfig: {
        thinkingLevel: ThinkingLevel.HIGH,
    },
    safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ],
    systemInstruction: {
        parts: [systemPrompt],
    },
};

const setupCachedSystemPrompt = async (ai: GoogleGenAI, model: string) => {
    const cacheName = 'ccvd';

    try {
        const existingCaches = await ai.caches.list()
        const existingCache = existingCaches.getItem(0)

        if (existingCache.displayName === cacheName) {
            return existingCache;
        } else {
            throw new Error()
        }
    } catch (_) {
        return await ai.caches.create({
            model: model,
            config: {
                displayName: cacheName,
                systemInstruction: {
                    parts: [systemPrompt],
                },
            },
        });
    }
}

export const maxDuration = 120;

export async function POST(request: Request) {
    try {
        const { message, video } = await request.json();

        const ai = await createGoogleAiClient();
        const model = 'gemini-3-flash-preview';

        await setupCachedSystemPrompt(ai, model);

        let contents: ContentListUnion = [{ role: 'user', parts: [{ text: message }] }]
        if (video) {
            contents[0].parts?.push(createPartFromUri(video.uri, video.mimeType))
        }

        const responseStream = await ai.models.generateContentStream({
            model: model,
            contents: contents,
            config: generationConfig,
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
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache',
            },
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Etwas ist schiefgelaufen' + error }, { status: 500 });
    }
}
