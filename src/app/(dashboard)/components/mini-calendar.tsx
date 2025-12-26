import { format, isSameDay, isSameMonth, isToday } from "date-fns";
import { de } from "date-fns/locale";
import React from "react";

interface MiniCalendarProps {
    currentDate: Date;
    selectedDate: Date;
    calendarDays: Date[];
    onSelectDate: (date: Date) => void;
    onNextMonth: () => void;
    onPrevMonth: () => void;
    hasEvents: (date: Date) => boolean;
    isLoading: boolean;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({
    currentDate,
    selectedDate,
    calendarDays,
    onSelectDate,
    onNextMonth,
    onPrevMonth,
    hasEvents,
    isLoading,
}) => {
    return (
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
            <div
                className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 relative ${isLoading
                    ? 'opacity-70 pointer-events-none'
                    : ''}`}
            >

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 rounded-xl">
                        <div className="h-6 w-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Header Navigation */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={onPrevMonth}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500"
                        disabled={isLoading}
                    >←
                    </button>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {format(currentDate, "MMMM yyyy", { locale: de })}
                    </span>
                    <button
                        onClick={onNextMonth}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500"
                        disabled={isLoading}
                    >→
                    </button>
                </div>

                {/* Weekday Names */}
                <div className="grid grid-cols-7 mb-2 text-xs text-center text-gray-400 font-medium">
                    {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map(d => <div key={d}>{d}</div>)}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, idx) => {
                        const isSelected = isSameDay(day, selectedDate);
                        const isCurrent = isSameMonth(day, currentDate);
                        const isTodayDate = isToday(day);
                        const showDot = hasEvents(day);

                        return (
                            <button
                                key={idx}
                                onClick={() => onSelectDate(day)}
                                className={`
                                    h-9 w-9 rounded-full flex items-center justify-center text-sm relative transition-all mx-auto
                                    ${!isCurrent
                                    ? "text-gray-300 dark:text-gray-700"
                                    : "text-gray-700 dark:text-gray-300"}
                                    ${isSelected
                                    ? "bg-brand-600 text-white font-bold shadow-md"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-800"}
                                    ${isTodayDate && !isSelected ? "border border-brand-500 text-brand-600" : ""}
                                `}
                            >
                                {format(day, "d")}
                                {showDot && !isSelected && (
                                    <span className="absolute bottom-1 w-1 h-1 bg-brand-500 rounded-full"></span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};