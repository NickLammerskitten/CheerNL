"use server";

import { createGoogleDriveClient } from "@/utils/google/google-drive";
import { drive_v3 } from 'googleapis';
import { GaxiosResponseWithHTTP2 } from "googleapis-common";

const TRAININGSPLAN_FOLDER_ID = process.env.TRAININGSPLAN_FOLDER_ID!;
const TRAININGSPLAN_VORLAGEN_FOLDER_ID = process.env.TRAININGSPLAN_VORLAGEN_FOLDER_ID!;

export const listTrainingsplanVorlagenFiles = async (): Promise<GaxiosResponseWithHTTP2<drive_v3.Schema$FileList>> => {
    const drive = await createGoogleDriveClient();

    const searchString = `'${TRAININGSPLAN_VORLAGEN_FOLDER_ID}' in parents`

    return await drive.files.list({
        q: searchString,
        supportsAllDrives: true,
    });
}

export const getFile = async (fileId: string): Promise<GaxiosResponseWithHTTP2<drive_v3.Schema$File>> => {
    const drive = await createGoogleDriveClient();

    return await drive.files.get({
        fileId: fileId,
    });
}

export const createAthleteFolder = async (name: string, athleteEmail: string): Promise<string> => {
    const drive = await createGoogleDriveClient();

    const fileMetadata = {
        name: name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [TRAININGSPLAN_FOLDER_ID],
    };

    try {
        const file = await drive.files.create({
            requestBody: fileMetadata,
            fields: 'id',
        });

        if (!file.data.id) {
            throw new Error("Fehler beim Erstellen des Ordners");
        }

        await shareRessource(file.data.id, athleteEmail, 'writer');

        console.log('Ordner erstellt, ID:', file.data.id);
        return file.data.id;
    } catch (error) {
        console.error('Fehler beim Erstellen des Ordners:', error);
        throw error;
    }
}

export const shareRessource = async (driveId: string, email: string, role: 'reader' | 'writer') => {
    const drive = await createGoogleDriveClient();
    await drive.permissions.create({
        fileId: driveId,
        requestBody: { role, type: 'user', emailAddress: email },
    });
}

export const deleteFolder = async (folderId: string) => {
    const drive = await createGoogleDriveClient();
    await drive.files.delete({
        fileId: folderId,
    })
}
