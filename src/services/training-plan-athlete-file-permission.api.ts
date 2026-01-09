import {FilePermissionListItemData} from "@/schemas/training-plan-athlete-file-permission.schema";
import {fetchTrainingPlanAthlete} from "@/services/training-plan-athlete.api";
import {getFilePermissions} from "@/services/external/google-drive-files.api";

export async function fetchTrainingPlanAthleteFilePermissionList(trainingPlanAthleteId: string): Promise<FilePermissionListItemData[]> {
    const trainingPlanAthlete = await fetchTrainingPlanAthlete(trainingPlanAthleteId);

    if (!trainingPlanAthlete.googleDriveFolderId) {
        return [];
    }

    try {
        return getFilePermissions(trainingPlanAthlete.googleDriveFolderId);
        // @ts-expect-error: No specific error type due to missing docs
    } catch (e: Error) {
        console.error('Es ist ein Fehler beim Import der File Permissions aufgetreten', e.message);
        return [];
    }
}