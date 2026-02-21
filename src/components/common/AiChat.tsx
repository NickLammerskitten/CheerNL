"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
    role: "user" | "assistant";
    content: string;
};

interface AiChatProps {
    onSendMessage: (message: string) => Promise<ReadableStream<Uint8Array> | null>;
    headline?: string;
    subHeadline?: string;
    messagesPlaceholder?: string;
    chatPlaceholder?: string;
}

export default function AiChat({
    onSendMessage,
    headline,
    subHeadline,
    messagesPlaceholder,
    chatPlaceholder,
}: AiChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
            const stream = await onSendMessage(userMessage);

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
        <div className="flex flex-col h-screen max-w-3xl mx-auto bg-slate-50 shadow-xl overflow-hidden sm:rounded-2xl sm:h-[90vh] sm:mt-8 border border-slate-200">
            {/* Header */}
            <div className="bg-blue-900 px-6 py-4 shadow-md z-10">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    {headline ?? "AI-Chat"}
                </h1>
                <p className="text-blue-200 text-sm">{subHeadline}</p>
            </div>

            {/* Chat Verlauf */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
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
            <div className="bg-white p-4 border-t border-slate-200">
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
                    <div className="flex flex-col items-end">
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