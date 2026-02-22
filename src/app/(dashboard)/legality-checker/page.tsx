"use client"

import AiChat from "@/components/common/AiChat";
import { removeFileFromGoogleAi, uploadFileToGoogleAi } from "@/services/ai-file-managing.service";
import { fetchRulingStream } from "@/services/ai-rule-judge.service";

export default function LegalityCheckerPage() {

    return (
        <AiChat
            headline={"AI Rule-Judge (Experimentell)"}
            subHeadline={"Alle Angaben ohne Gewähr. Eine KI kann Fehler machen. Alle Aussagen sind auf ihre" +
                " Richtigkeit zu prüfen. Eine sichere Aussage kann nur vom CCVD gewährt werden."}
            messagesPlaceholder={"Erhalte deine Einschätzung zum CCVD Regelwerk"}
            chatPlaceholder={"Level: 3, Element: Standing Flick Flack"}
            onUploadFile={uploadFileToGoogleAi}
            onRemoveFile={removeFileFromGoogleAi}
            onSendMessage={fetchRulingStream}
        />
    )
}