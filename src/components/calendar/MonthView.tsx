import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { isToday, isSameDay } from '../../utils/dateUtils';
import { Task } from '../../types/task';

export const MonthView: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    tasks,
    subjects,
    openTaskModal,
    setCalendarView,
  } = useApp();

  const subjectMap = useMemo(() => {
    const map = new Map<string, (typeof subjects)[0]>();
    subjects.forEach((s) => map.set(s.id, s));
    return map;
  }, [subjects]);

  // Generate calendar days for month grid (6 weeks x 7 days)
  const calendarDays = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const dayOfWeek = firstDay.getDay(); // 0 is Sunday
    // Monday as start of week: diff = (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
    const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - offset);

    const days: Date[] = [];
    for (let i = 0; i < 35; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      days.push(d);
    }
    return days;
  }, [selectedDate]);

  const weekDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#111317] overflow-hidden select-none">
      {/* Month Header Days */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 bg-[#fcfcfd] dark:bg-[#14161b] text-center text-xs py-2 font-medium text-gray-500 dark:text-gray-400">
        {weekDayNames.map((name) => (
          <div key={name} className="uppercase tracking-wider text-[11px]">
            {name}
          </div>
        ))}
      </div>

      {/* 5x7 Month Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-5 divide-x divide-y divide-gray-200 dark:divide-gray-800 overflow-y-auto">
        {calendarDays.map((day, idx) => {
          const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
          const isDayToday = isToday(day);

          // Get tasks for this day
          const dayTasks = tasks.filter((t) => {
            const tDate = t.scheduledStart ? new Date(t.scheduledStart) : new Date(t.dueDate);
            return isSameDay(tDate, day);
          });

          return (
            <div
              key={idx}
              onClick={() => {
                setSelectedDate(day);
                setCalendarView('day');
              }}
              className={`p-1.5 flex flex-col justify-between hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer transition-colors ${
                !isCurrentMonth ? 'opacity-40 bg-gray-50/50 dark:bg-gray-900/30' : ''
              } ${isDayToday ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold ${
                    isDayToday
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {day.getDate()}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-[10px] text-gray-400 font-mono">
                    {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                )}
              </div>

              {/* Preview badges */}
              <div className="mt-1 space-y-1 flex-1 overflow-hidden">
                {dayTasks.slice(0, 3).map((task) => {
                  const sub = subjectMap.get(task.subjectId);
                  const isDone = task.status === 'completed';
                  return (
                    <div
                      key={task.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        openTaskModal(task);
                      }}
                      className={`px-1.5 py-0.5 rounded text-[10px] truncate font-medium flex items-center space-x-1 ${
                        isDone
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 line-through'
                          : 'bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800/40'
                      }`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: sub?.color || '#a855f7' }}
                      />
                      <span className="truncate">{task.title}</span>
                    </div>
                  );
                })}
                {dayTasks.length > 3 && (
                  <div className="text-[9px] text-gray-400 font-medium pl-1">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
