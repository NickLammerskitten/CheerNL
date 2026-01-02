import { EyeIcon, LockIcon, PencilIcon } from "@/icons";
import { TrainingPlanAthleteListItemData } from "@/schemas/training-plan-athlete.schema";
import { FilePermission } from "@/services/google-drive/google-drive-files.api";
import React from "react";

interface TrainingPlanAthleteDetailsProps {
    trainingPlanAthlete: TrainingPlanAthleteListItemData;
    folderPermissions: FilePermission[] | undefined;
}

export default function TrainingPlanAthleteDetails({
    trainingPlanAthlete,
    folderPermissions,
}: TrainingPlanAthleteDetailsProps) {

    return (
        <>
            <div className={"grid grid-cols-[auto_1fr] gap-x-4 gap-y-1"}>
                <div className="font-medium dark:text-white/70">Name</div>
                <div className="dark:text-white/90">
                    {trainingPlanAthlete.firstName + " " + trainingPlanAthlete.lastName}
                </div>

                <div className="font-medium dark:text-white/70">Trainingsplan</div>
                <div className="dark:text-white/90">
                    {trainingPlanAthlete.trainingPlanName}
                </div>

                <div className="font-medium dark:text-white/70">Google Email</div>
                <div className="dark:text-white/90">
                    {trainingPlanAthlete.googleEmailAddress}
                </div>

                <div className="font-medium dark:text-white/70">Berechtigungen</div>
                <div className="dark:text-white/90">
                    {!folderPermissions || folderPermissions.length === 0
                        && "Keine Berechtigungen oder kein Ordner zugewiesen"
                    }

                    <ul>
                        {folderPermissions?.map((permission, index) => {
                            return (
                                <li
                                    key={index}
                                    className={"flex row gap-1"}
                                >
                                    <span className={"flex items-center"}>
                                        {permission.role === 'owner'
                                            ? <LockIcon />
                                            : permission.role === 'writer'
                                                ? <PencilIcon />
                                                : <EyeIcon />
                                        }
                                    </span>
                                    <span className={"break-all"}>
                                        {permission.emailAddress}
                                    </span>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </>
    )
}