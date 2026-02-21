"use server"

import { createGoogleAiClient } from "@/utils/google/googel-ai-client";
import { File as GoogleFile } from "@google/genai"

export async function uploadFileToGoogleAi(file: File): Promise<GoogleFile | null> {
    try {
        const googleAi = await createGoogleAiClient();
        return await googleAi.files.upload({
            file: file,
            config: {
                mimeType: file.type,
                displayName: file.name,
            },
        });
    } catch (error) {
        return null;
    }
}

export async function removeFileFromGoogleAi(file: GoogleFile): Promise<void> {
    if (!file.name) {
        return;
    }

    try {
        const googleAi = await createGoogleAiClient();
        await googleAi.files.delete({
            name: file.name,
        })
    } catch (error) {
        console.error(error);
    }
}