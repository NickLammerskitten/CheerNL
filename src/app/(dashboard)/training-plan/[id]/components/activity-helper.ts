import { TrainingPlanAthleteActivity } from "@/schemas/training-plan-athlete-activity.schema";
import { useMemo } from 'react';

export type TimeRange = 'currentMonth' | 'lastMonth' | 'year' | 'lastYear' | 'allTime';

export const useActivityStats = (
    activities: TrainingPlanAthleteActivity[],
    range: TimeRange,
) => {
    return useMemo(() => {
        const { start, end, prevStart, prevEnd } = getDateRange(range);

        const editActivities = activities.filter((activity) => {
            return activity.action === 'edit';
        })

        const currentActivities = filterActivitiesByTime(editActivities, start, end);
        const prevActivities = filterActivitiesByTime(editActivities, prevStart, prevEnd);

        const trainingDays = countUniqueDays(currentActivities);
        const prevTrainingDays = countUniqueDays(prevActivities);

        const weeklyAverage = calculateWeeklyAverage(trainingDays, start, end);
        const trendPercent = calculateTrendPercent(trainingDays, prevTrainingDays);
        const totalActivitiesCount = currentActivities.length;
        const filesUploaded = currentActivities.filter(a => a.file?.link).length;

        return {
            trainingDays: trainingDays,
            prevTrainingDays: prevTrainingDays,
            totalActivities: totalActivitiesCount,
            weeklyAverage: weeklyAverage,
            trendPercent: trendPercent,
            filesUploaded: filesUploaded,
        };
    }, [activities, range]);
};

const getDateRange = (range: TimeRange, referenceDate = new Date()) => {
    const start = new Date(referenceDate);
    const end = new Date(referenceDate);
    const prevStart = new Date(referenceDate);
    const prevEnd = new Date(referenceDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    switch (range) {
        case 'currentMonth':
            start.setDate(1); // 1. des Monats
            // Vergleich: Letzter Monat
            prevStart.setMonth(prevStart.getMonth() - 1);
            prevStart.setDate(1);
            prevEnd.setDate(0); // Letzter Tag des Vormonats
            break;

        case 'lastMonth':
            start.setMonth(start.getMonth() - 1);
            start.setDate(1);
            end.setDate(0);
            // Vergleich: Vor-Vormonat
            prevStart.setMonth(prevStart.getMonth() - 2);
            prevStart.setDate(1);
            prevEnd.setMonth(prevEnd.getMonth() - 1);
            prevEnd.setDate(0);
            break;

        case 'year':
            start.setMonth(0, 1); // 1. Januar
            // Vergleich: Letztes Jahr
            prevStart.setFullYear(prevStart.getFullYear() - 1);
            prevStart.setMonth(0, 1);
            prevEnd.setFullYear(prevEnd.getFullYear() - 1);
            prevEnd.setMonth(11, 31);
            break;

        case 'lastYear':
            start.setFullYear(start.getFullYear() - 1);
            start.setMonth(0, 1);
            end.setFullYear(end.getFullYear() - 1);
            end.setMonth(11, 31);

            prevStart.setFullYear(prevStart.getFullYear() - 2);
            prevStart.setMonth(0, 1);
            prevEnd.setFullYear(prevEnd.getFullYear() - 2);
            prevEnd.setMonth(11, 31);
            break;

        default:
            start.setFullYear(1970);
            break;
    }

    return { start, end, prevStart, prevEnd };
};

const filterActivitiesByTime = (activities: TrainingPlanAthleteActivity[], start: Date, end: Date) => {
    return activities.filter(a => {
        const d = new Date(a.timestamp);
        return d >= start && d <= end;
    });
}

const countUniqueDays = (activities: TrainingPlanAthleteActivity[]) => {
    const uniqueDays = new Set(
        activities.map((a) => {
            return new Date(a.timestamp).toDateString();
        }),
    );
    return uniqueDays.size;
};

const calculateWeeklyAverage = (trainingDays: number, start: Date, end: Date) => {
    const now = new Date();
    const isCurrentPeriod = end >= now;
    const calcEnd = isCurrentPeriod ? now : end;
    const effectiveEnd = calcEnd < start ? start : calcEnd;

    const diffInMs = effectiveEnd.getTime() - start.getTime();
    const daysDiff = Math.max(1, Math.ceil(diffInMs / (1000 * 60 * 60 * 24)));
    const weeksPassed = daysDiff / 7;

    return weeksPassed > 0 ? (trainingDays / weeksPassed).toFixed(1) : '0.0';
}

const calculateTrendPercent = (trainingDays: number, prevTrainingDays: number) => {
    let trendPercent = 0;
    if (prevTrainingDays > 0) {
        trendPercent = Math.round(((trainingDays - prevTrainingDays) / prevTrainingDays) * 100);
    } else if (trainingDays > 0) {
        trendPercent = 100;
    }

    return trendPercent;
}