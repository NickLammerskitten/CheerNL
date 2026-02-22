"use client";

import { FileIcon } from "@/icons";
import { File as GoogleFile } from "@google/genai";
import React, { useEffect, useRef, useState } from "react";

type Message = {
    role: "user" | "assistant";
    content: string;
};

interface AiChatProps {
    onUploadFile: (file: File) => Promise<GoogleFile | null>;
    onRemoveFile: (file: GoogleFile) => Promise<void>;
    onSendMessage: (message: string, video: GoogleFile | null) => Promise<ReadableStream<Uint8Array> | null>;
    headline?: string;
    subHeadline?: string;
    messagesPlaceholder?: string;
    chatPlaceholder?: string;
}

export default function AiChat({
    onUploadFile,
    onRemoveFile,
    onSendMessage,
    headline,
    subHeadline,
    messagesPlaceholder,
    chatPlaceholder,
}: AiChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [isVideoUploading, setIsFileUploading] = useState(false);
    // const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadedVideo, setUploadedFile] = useState<GoogleFile | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        setIsFileUploading(true);
        // setUploadError(null);
        setUploadedFile(null);

        try {
            const uploadedFile = await onUploadFile(file);

            if (uploadedFile) {
                setUploadedFile(uploadedFile);
            } else {
                //setUploadError("Upload fehlgeschlagen.");
            }
        } catch (error) {
            console.error(error);
            //setUploadError("Ein Netzwerkfehler ist aufgetreten.");
        } finally {
            setIsFileUploading(false);
            e.target.value = '';
        }
    }

    const handleRemoveVideo = () => {
        if (uploadedVideo) {
            onRemoveFile(uploadedVideo)
        }

        setUploadedFile(null);
        //setUploadError(null);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) {
            return;
        }

        const userMessage = input.trim();
        setInput("");
        setIsLoading(true);

        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        try {
            const stream = await onSendMessage(userMessage, uploadedVideo);

            if (!stream) {
                throw new Error("Kein Response Stream gefunden");
            }

            const reader = stream.getReader();
            const decoder = new TextDecoder("utf-8");

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });

                setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastIndex = newMessages.length - 1;
                    newMessages[lastIndex] = {
                        ...newMessages[lastIndex],
                        content: newMessages[lastIndex].content + chunk,
                    };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Fehler beim Abrufen der KI-Antwort:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Entschuldigung, es gab einen Fehler." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[85dvh] sm:h-[82dvh] max-w-3xl mx-auto bg-slate-50 shadow-xl sm:rounded-2xl border border-slate-200">
            {/* Header */}
            <div className="bg-blue-900 px-6 py-4 shadow-md z-10">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    {headline ?? "AI-Chat"}
                </h1>
                <p className="text-blue-200 text-sm">{subHeadline}</p>
            </div>

            {/* Chat Verlauf */}
            <div className="flex-grow overflow-y-auto p-2 space-y-6 bg-slate-50">
                {messages.length === 0 ? (
                    <div className="text-center text-slate-400 mt-20">
                        <p className="text-lg font-medium">{messagesPlaceholder}</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${
                                    msg.role === "user"
                                        ? "bg-blue-600 text-white rounded-br-sm"
                                        : "bg-white text-slate-800 border border-slate-100 rounded-bl-sm"
                                }`}
                            >
                                <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                                    {msg.content}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Bereich */}
            <div className="flex-none bg-white p-2 border-t border-slate-200">
                <form
                    onSubmit={handleSend}
                    className="flex gap-3 flex-col"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        placeholder={chatPlaceholder}
                        className="flex-1 bg-slate-100 text-slate-800 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 border border-transparent focus:bg-white"
                    />

                    <div className="flex flex-col justify-items-normal sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 flex items-center">
                            {isVideoUploading ? (
                                <span className="text-sm text-blue-600 animate-pulse px-4 py-2">
                                    ⏳ Video wird verarbeitet... das kann einen Moment dauern.
                                </span>
                            ) : uploadedVideo ? (
                                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
                                    <span
                                        className="truncate max-w-[200px]"
                                        title={uploadedVideo.name}
                                    >
                                        {uploadedVideo.displayName}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleRemoveVideo}
                                        disabled={isLoading}
                                        className="ml-2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-blue-200 text-blue-500 hover:text-blue-800 transition-colors disabled:opacity-50"
                                        aria-label="Video entfernen"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <label
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all border border-transparent focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
                                        ${isLoading
                                        ? "opacity-50 cursor-not-allowed bg-slate-50 text-slate-500"
                                        : "bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
                                    }`}
                                >
                                    {/* Dein neues Icon */}
                                    <FileIcon className="w-5 h-5" />
                                    <span>Video auswählen</span>

                                    <input
                                        type="file"
                                        accept="video/mp4,video/quicktime,video/x-m4v,.mp4,.mov,.m4v"
                                        onChange={handleFileChange}
                                        disabled={isLoading}
                                        className="sr-only"
                                    />
                                </label>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-blue-600 text-white rounded-full px-6 py-3 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                        >
                            {isLoading ? (
                                <span className="animate-pulse">Denkt...</span>
                            ) : (
                                "Senden"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}