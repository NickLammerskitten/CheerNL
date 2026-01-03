"use server";

import {
    CreateTrainingPlanAthleteActivity,
    CreateTrainingPlanAthleteActivitySchema,
} from "@/schemas/training-plan-athlete-activity.schema";
import { createGoogleDriveActivityClient } from "@/utils/google/google-drive";
import { driveactivity_v2 } from "googleapis";

interface DriveActivitiesResponse {
    data: CreateTrainingPlanAthleteActivity[];
    nextPageToken: string | null;
}

export const listDriveActivities = async (
    folderId: string,
    athleteId: string,
    importFrom: Date | null,
): Promise<DriveActivitiesResponse> => {
    const service = await createGoogleDriveActivityClient();

    let filter = 'detail.action_detail_case:(CREATE EDIT)';
    if (importFrom) {
        const timestamp = new Date(importFrom).getTime();
        filter += ` time > ${timestamp}`;
    }

    const response = await service.activity.query({
        requestBody: {
            ancestorName: `items/${folderId}`,
            pageSize: 50,
            filter: filter,
        },
    });

    const rawActivities = response.data.activities || [];

    const formattedActivities = await Promise.all(rawActivities.map(async (activity) => {
        const actorResource = activity.actors?.[0]?.user?.knownUser?.personName;

        const rawAction = getActionKey(activity.primaryActionDetail);

        const target = activity.targets?.[0]?.driveItem;
        const fileId = getFileId(target?.name);

        const rawObj = {
            id: `${activity.timestamp}-${fileId}`,
            training_plan_athlete_id: athleteId,
            google_drive_folder_id: folderId,
            timestamp: activity.timestamp || new Date().toISOString(),
            action: rawAction,
            actor: actorResource,
            file_id: fileId,
            file_name: target?.title || 'Unbekannte Datei',
            file_mime_type: target?.mimeType,
            file_link: fileId ? `https://docs.google.com/open?id=${fileId}` : undefined,
        };

        const parsed = CreateTrainingPlanAthleteActivitySchema.safeParse(rawObj);

        if (!parsed.success) {
            return null;
        }

        return parsed.data;
    }));

    const filteredActivities = formattedActivities.filter((a): a is CreateTrainingPlanAthleteActivity => a !== null);

    return {
        data: filteredActivities,
        nextPageToken: response.data.nextPageToken ?? null,
    };
}

function getActionKey(detail: driveactivity_v2.Schema$ActionDetail | undefined): string {
    if (!detail) {
        return 'unknown';
    }

    // Die Keys sind z.B. 'create', 'edit', 'move'. Wir nehmen den ersten gefundenen.
    const keys = Object.keys(detail);
    return keys.length > 0 ? keys[0] : 'unknown';
}

function getFileId(targetName: string | null | undefined): string | null {
    if (!targetName) {
        return null;
    }
    return targetName.replace('items/', '');
}