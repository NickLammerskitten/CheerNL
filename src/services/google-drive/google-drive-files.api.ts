"use server";

import { createGoogleDriveClient } from "@/utils/google/google-drive";
import { drive_v3 } from 'googleapis';
import { GaxiosResponseWithHTTP2 } from "googleapis-common";

// TODO: Save in Database
const TRAININGSPLAN_FOLDER_ID = '1pyWu9XFLaOVbH97BUr28ZHpkRj39EM7r';
const TRAININGSPLAN_VORLAGEN_FOLDER_ID = '1eClkcETwLIOpDkVXxDbPn5cWe4EqFocp';

export const googleDriveFolderId = async (): Promise<string> => {
    return TRAININGSPLAN_FOLDER_ID;
}

export const listTrainingsplanVorlagenFiles = async (): Promise<GaxiosResponseWithHTTP2<drive_v3.Schema$FileList>> => {
    const drive = await createGoogleDriveClient();

    const searchString = `'${TRAININGSPLAN_VORLAGEN_FOLDER_ID}' in parents`

    return await drive.files.list({
        q: searchString,
        supportsAllDrives: true,
    });
}

export const listAll = async (): Promise<GaxiosResponseWithHTTP2<drive_v3.Schema$FileList>> => {
    const drive = await createGoogleDriveClient();

    const searchString = `'${TRAININGSPLAN_FOLDER_ID}' in parents`

    return await drive.files.list({
        q: searchString,
        supportsAllDrives: true,
    });
};

export const getFile = async (fileId: string): Promise<GaxiosResponseWithHTTP2<drive_v3.Schema$File>> => {
    const drive = await createGoogleDriveClient();

    return await drive.files.get({
        fileId: fileId,
    });
}
