"use client"

import { StatCard } from "@/app/(dashboard)/training-plan/[id]/components/actitvity-stat-card";
import { TimeRange, useActivityStats } from "@/app/(dashboard)/training-plan/[id]/components/activity-helper";
import { TaskIcon, WeightliftingIcon } from "@/icons";
import { TrainingPlanAthleteActivity } from "@/schemas/training-plan-athlete-activity.schema";
import { useState } from 'react';

interface DashboardProps {
    data: TrainingPlanAthleteActivity[];
}

export const ActivityDashboard = ({ data }: DashboardProps) => {
    const [selectedRange, setSelectedRange] = useState<TimeRange>('currentMonth');

    const stats = useActivityStats(data, selectedRange);

    const rangeLabels: Record<TimeRange, string> = {
        currentMonth: 'Diesen Monat',
        lastMonth: 'Letzten Monat',
        year: 'Dieses Jahr',
        lastYear: 'Letztes Jahr',
        allTime: 'Gesamt',
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-slate-900">Trainings Übersicht</h2>

                <div className="flex bg-slate-100 p-1 rounded-lg self-start">
                    {(Object.keys(rangeLabels) as TimeRange[]).map((key) => (
                        <button
                            key={key}
                            onClick={() => setSelectedRange(key)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                                selectedRange === key
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {rangeLabels[key]}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                    title="Trainingstage"
                    value={stats.trainingDays}
                    trend={stats.trendPercent}
                    trendLabel={selectedRange === 'allTime' ? undefined
                        : selectedRange === 'year' || selectedRange === 'lastYear'
                            ? 'vs.' + ' Vorjahr'
                            : 'vs.' + ' Vormonat'}
                    icon={<WeightliftingIcon className="w-5 h-5" />}
                />

                <StatCard
                    title="Durchschnitt / Woche"
                    value={stats.weeklyAverage}
                    icon={<TaskIcon className="w-5 h-5" />}
                />
            </div>
        </div>
    );
};