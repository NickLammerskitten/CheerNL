import { TrainingPlanAthleteActivity } from "@/schemas/training-plan-athlete-activity.schema";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useMemo } from "react";

interface TrainingPlanAthleteActivitiesProps {
    activities: TrainingPlanAthleteActivity[]
}

export default function TrainingPlanAthleteActivities({ activities }: TrainingPlanAthleteActivitiesProps) {

    const groupedActivities = useMemo(() => {
        const groups: Record<string, TrainingPlanAthleteActivity[]> = {};

        const sortedActivities = [...activities].sort((a, b) =>
            b.timestamp.getTime() - a.timestamp.getTime(),
        );

        sortedActivities.forEach((activity) => {
            const dateKey = format(activity.timestamp, 'yyyy-MM-dd');

            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(activity);
        });

        return groups;
    }, [activities]);

    const sortedGroupKeys = Object.keys(groupedActivities).sort((a, b) =>
        new Date(b).getTime() - new Date(a).getTime(),
    );

    if (activities.length === 0) {
        return <span className="dark:text-white/90">Keine Aktivitäten.</span>;
    }

    return (
        <div className="flex flex-col gap-y-6">
            <h1 className="dark:text-white/90">Aktivitäten</h1>

            {sortedGroupKeys.map((dateKey) => (
                <div
                    key={dateKey}
                    className="flex flex-col gap-y-2"
                >
                    <h3 className="font-bold text-sm text-gray-500 dark:text-gray-400 border-b pb-1 mb-1 border-gray-200 dark:border-gray-700">
                        {format(new Date(dateKey), "eeee, dd.MM.yyyy", { locale: de })}
                    </h3>

                    <div className="flex flex-col gap-y-1 pl-2">
                        {groupedActivities[dateKey].map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-center gap-x-2 text-sm"
                            >
                                <span className="text-xs text-gray-400 font-mono">
                                    {format(activity.timestamp, "HH:mm")}
                                </span>
                                <span className="dark:text-white/90">
                                    {actionToString(activity.action)}
                                    {activity.file.name &&
                                        <span className="italic text-xs ml-1">
                                            ({activity.file.name})
                                        </span>
                                    }
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function actionToString(action: string) {
    return action === "edit" ? "Bearbeitet"
        : action === "create" ? "Erstellt"
            : action;
}