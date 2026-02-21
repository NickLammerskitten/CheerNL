"use client"

import AiChat from "@/components/common/AiChat";
import { removeFileFromGoogleAi, uploadFileToGoogleAi } from "@/services/ai-file-managing.service";
import { fetchRulingStream } from "@/services/ai-rule-judge.service";

export default function LegalityCheckerPage() {

    return (
        <AiChat
            headline={"AI Rule-Judge (Experimentell)"}
            subHeadline={"Frage nach Elementen, um Auskunft über Legalität zu erhalten"}
            messagesPlaceholder={"Erhalte deine Einschätzung"}
            chatPlaceholder={"Level: 3, Element: Standing Flick Flack"}
            onUploadFile={uploadFileToGoogleAi}
            onRemoveFile={removeFileFromGoogleAi}
            onSendMessage={fetchRulingStream}
        />
    )
}