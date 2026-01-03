import { ArrowDownIcon, ArrowUpIcon } from "@/icons";
import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    trend?: number;
    trendLabel?: string;
    icon?: React.ReactNode;
}

export const StatCard = ({ title, value, trend, trendLabel, icon }: StatCardProps) => {
    const isPositive = trend && trend > 0;
    const isNeutral = !trend || trend === 0;

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
                </div>
                {icon && <div className="p-2 bg-slate-50 rounded-lg text-slate-600">{icon}</div>}
            </div>

            {trend !== undefined && (
                <div className="mt-4 flex items-center text-sm">
                    <span
                        className={`flex items-center font-medium ${
                            isPositive ? 'text-green-600' : isNeutral ? 'text-slate-500' : 'text-red-600'
                        }`}
                    >
                        {isPositive && <ArrowUpIcon className="w-4 h-4 mr-1" />}
                        {!isPositive && !isNeutral && <ArrowDownIcon className="w-4 h-4 mr-1" />}
                        {isNeutral && <ArrowDownIcon className="w-4 h-4 mr-1" />}
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                    <span className="text-slate-400 ml-2">{trendLabel || 'vs. Vorperiode'}</span>
                </div>
            )}
        </div>
    );
};