"use server"

import { google } from "googleapis";

const CLIENT_EMAIL = process.env.NEXT_PRIVATE_TRAININGSPLAENE_EMAIL;
const API_KEY = process.env.NEXT_PRIVATE_TRAININGSPLAENE_PRIVATE_KEY!.replace(/\\n/g, '\n');

const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.JWT({
    email: CLIENT_EMAIL,
    key: API_KEY,
    scopes: SCOPES
});

const drive = google.drive({ version: 'v3', auth: auth });

export async function createGoogleDriveClient() {
    return drive;
}