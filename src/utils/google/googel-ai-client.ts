"use server"

import { GoogleGenAI } from "@google/genai";

export async function createGoogleAiClient(): Promise<GoogleGenAI> {
    const apiKey = process.env.NEXT_PRIVATE_GOOGLE_VERTEX_API_KEY;
    return new GoogleGenAI({ apiKey: apiKey })
}