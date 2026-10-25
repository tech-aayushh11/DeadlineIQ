import React from 'react';
import { ChevronLeft, ChevronRight, SlidersHorizontal, Calendar as CalIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatMonthYear, getWeekDays } from '../../utils/dateUtils';
import { CalendarViewMode } from '../../types/calendar';

export const CalendarHeader: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    calendarView,
    setCalendarView,
    selectedSubjectFilter,
    setSelectedSubjectFilter,
    subjects,
  } = useApp();

  const handlePrev = () => {
    const d = new Date(selectedDate);
    if (calendarView === 'day') {
      d.setDate(d.getDate() - 1);
    } else if (calendarView === 'week') {
      d.setDate(d.getDate() - 7);
    } else {
      d.setMonth(d.getMonth() - 1);
    }
    setSelectedDate(d);
  };

  const handleNext = () => {
    const d = new Date(selectedDate);
    if (calendarView === 'day') {
      d.setDate(d.getDate() + 1);
    } else if (calendarView === 'week') {
      d.setDate(d.getDate() + 7);
    } else {
      d.setMonth(d.getMonth() + 1);
    }
    setSelectedDate(d);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const weekDays = getWeekDays(selectedDate);
  const weekRangeText = `${weekDays[0].toLocaleDateString([], { month: 'short', day: 'numeric' })} – ${weekDays[6].toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`;

  return (
    <div className="h-11 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111317] px-4 flex items-center justify-between text-xs select-none shrink-0">
      {/* Left: Today, Prev/Next, Date Range */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleToday}
          className="px-2.5 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-colors"
        >
          Today
        </button>

        <div className="flex items-center space-x-0.5 border border-gray-200 dark:border-gray-700 rounded p-0.5">
          <button
            onClick={handlePrev}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
            title="Previous"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNext}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
            title="Next"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">
            {calendarView === 'week' ? weekRangeText : formatMonthYear(selectedDate)}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded">
            IST
          </span>
        </div>
      </div>

      {/* Right: Subject Filter & View Toggle */}
      <div className="flex items-center space-x-2">
        {/* Subject Filter Pill */}
        {selectedSubjectFilter && (
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[11px]">
            <span>Filter: {subjects.find((s) => s.id === selectedSubjectFilter)?.shortName}</span>
            <button
              onClick={() => setSelectedSubjectFilter(null)}
              className="ml-1 hover:text-blue-900 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* View Switcher: Day / Week / Month */}
        <div className="flex rounded border border-gray-200 dark:border-gray-700 p-0.5 bg-gray-50 dark:bg-gray-800/80">
          {(['day', 'week', 'month'] as CalendarViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setCalendarView(mode)}
              className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                calendarView === mode
                  ? 'bg-white dark:bg-[#111317] text-gray-900 dark:text-white shadow-xs font-semibold'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
