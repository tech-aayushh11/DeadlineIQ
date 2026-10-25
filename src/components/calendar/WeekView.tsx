import React, { useRef, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EventBlock } from './EventBlock';
import { getWeekDays, isToday, isSameDay } from '../../utils/dateUtils';
import { Task } from '../../types/task';
import { AcademicCommitment } from '../../types/calendar';

const START_HOUR = 7; // 7 AM
const END_HOUR = 23; // 11 PM
const TOTAL_HOURS = END_HOUR - START_HOUR;
const HOUR_HEIGHT = 52; // pixels per hour
const MINUTE_HEIGHT = HOUR_HEIGHT / 60; // ~0.866 px per min

interface PositionedEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  isFixedAcademic: boolean;
  subjectId: string;
  task?: Task;
  location?: string;
  top: number;
  height: number;
  leftOffsetPercent: number;
  widthPercent: number;
}

export const WeekView: React.FC = () => {
  const {
    selectedDate,
    tasks,
    timetable,
    subjects,
    selectedSubjectFilter,
    openTaskModal,
    toggleTaskComplete,
  } = useApp();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);

  // Subject lookup
  const subjectMap = useMemo(() => {
    const map = new Map<string, (typeof subjects)[0]>();
    subjects.forEach((s) => map.set(s.id, s));
    return map;
  }, [subjects]);

  // Auto-scroll to 8:30 AM on initial load
  useEffect(() => {
    if (scrollContainerRef.current) {
      const targetScroll = (8.5 - START_HOUR) * HOUR_HEIGHT;
      scrollContainerRef.current.scrollTop = Math.max(0, targetScroll);
    }
  }, []);

  // Compute current time position
  const now = new Date();
  const currentMinutesFromStart = (now.getHours() - START_HOUR) * 60 + now.getMinutes();
  const currentTimeTop = currentMinutesFromStart * MINUTE_HEIGHT;
  const isCurrentTimeVisible = now.getHours() >= START_HOUR && now.getHours() < END_HOUR;

  // Process and position events for each day of the week
  const dayEventsMap = useMemo(() => {
    const map = new Map<number, PositionedEvent[]>();

    weekDays.forEach((day, dayIndex) => {
      const events: PositionedEvent[] = [];

      // 1. Add scheduled tasks on this day
      tasks.forEach((task) => {
        if (!task.scheduledStart || !task.scheduledEnd) return;
        if (selectedSubjectFilter && task.subjectId !== selectedSubjectFilter) return;

        const start = new Date(task.scheduledStart);
        const end = new Date(task.scheduledEnd);

        if (isSameDay(start, day)) {
          const startMin = (start.getHours() - START_HOUR) * 60 + start.getMinutes();
          const durationMin = Math.max(20, (end.getTime() - start.getTime()) / (1000 * 60));

          if (startMin >= 0 && startMin < TOTAL_HOURS * 60) {
            events.push({
              id: task.id,
              title: task.title,
              start,
              end,
              isFixedAcademic: false,
              subjectId: task.subjectId,
              task,
              top: startMin * MINUTE_HEIGHT,
              height: durationMin * MINUTE_HEIGHT,
              leftOffsetPercent: 0,
              widthPercent: 100,
            });
          }
        }
      });

      // 2. Add fixed academic timetable commitments for this day of week
      const dayOfWeek = day.getDay();
      timetable.forEach((commitment: AcademicCommitment) => {
        if (commitment.dayOfWeek === dayOfWeek) {
          if (selectedSubjectFilter && commitment.subjectId !== selectedSubjectFilter) return;

          const [sh, sm] = commitment.startTime.split(':').map(Number);
          const [eh, em] = commitment.endTime.split(':').map(Number);

          const start = new Date(day);
          start.setHours(sh, sm, 0, 0);
          const end = new Date(day);
          end.setHours(eh, em, 0, 0);

          const startMin = (sh - START_HOUR) * 60 + sm;
          const durationMin = (eh - sh) * 60 + (em - sm);

          if (startMin >= 0 && startMin < TOTAL_HOURS * 60) {
            events.push({
              id: `academic-${commitment.id}-${day.toISOString().slice(0, 10)}`,
              title: commitment.title,
              start,
              end,
              isFixedAcademic: true,
              subjectId: commitment.subjectId,
              location: commitment.location,
              top: startMin * MINUTE_HEIGHT,
              height: durationMin * MINUTE_HEIGHT,
              leftOffsetPercent: 0,
              widthPercent: 100,
            });
          }
        }
      });

      // Sort events by start time
      events.sort((a, b) => a.top - b.top);

      // Simple collision resolver: if events overlap, split width side by side
      for (let i = 0; i < events.length; i++) {
        const evA = events[i];
        for (let j = i + 1; j < events.length; j++) {
          const evB = events[j];
          // Check vertical overlap
          if (evB.top < evA.top + evA.height - 2) {
            evA.widthPercent = 48;
            evA.leftOffsetPercent = 0;
            evB.widthPercent = 48;
            evB.leftOffsetPercent = 50;
          }
        }
      }

      map.set(dayIndex, events);
    });

    return map;
  }, [weekDays, tasks, timetable, selectedSubjectFilter]);

  // Handle clicking an empty calendar slot to quickly create task
  const handleSlotClick = (day: Date, hour: number) => {
    const start = new Date(day);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(day);
    end.setHours(hour + 1, 0, 0, 0);
    openTaskModal(null, { start, end });
  };

  const hoursArray = Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i);

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#111317] overflow-hidden select-none">
      {/* Week Days Header Row */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 bg-[#fcfcfd] dark:bg-[#14161b] shrink-0 pr-[6px]">
        {/* Time label corner cell */}
        <div className="w-14 shrink-0 border-r border-gray-200 dark:border-gray-800 py-2 text-center text-[10px] font-mono text-gray-400">
          GMT+5:30
        </div>

        {/* 7 Day Column Headers */}
        <div className="flex-1 grid grid-cols-7 divide-x divide-gray-200 dark:divide-gray-800">
          {weekDays.map((day, idx) => {
            const isDayToday = isToday(day);
            const dayName = day.toLocaleDateString([], { weekday: 'short' });
            const dayNum = day.getDate();

            return (
              <div
                key={idx}
                className={`py-2 text-center transition-colors ${
                  isDayToday ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                }`}
              >
                <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {dayName}
                </div>
                <div className="mt-0.5 flex justify-center">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                      isDayToday
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {dayNum}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scrollable Time Grid */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto relative">
        <div className="flex relative" style={{ height: `${TOTAL_HOURS * HOUR_HEIGHT}px` }}>
          {/* Left Vertical Hour Axis */}
          <div className="w-14 shrink-0 border-r border-gray-200 dark:border-gray-800 select-none">
            {hoursArray.map((hour) => {
              const displayHour = hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`;
              return (
                <div
                  key={hour}
                  style={{ height: `${HOUR_HEIGHT}px` }}
                  className="relative text-right pr-2 text-[10px] font-mono text-gray-400"
                >
                  <span className="-top-2.5 relative">{displayHour}</span>
                </div>
              );
            })}
          </div>

          {/* 7 Columns for Days */}
          <div className="flex-1 grid grid-cols-7 divide-x divide-gray-200 dark:divide-gray-800 relative">
            {weekDays.map((day, dayIdx) => {
              const dayEvents = dayEventsMap.get(dayIdx) || [];
              const isDayToday = isToday(day);

              return (
                <div
                  key={dayIdx}
                  className={`relative ${isDayToday ? 'bg-blue-50/15 dark:bg-blue-950/10' : ''}`}
                >
                  {/* Horizontal Hour Slot Lines & Clickable Area */}
                  {hoursArray.map((hour) => (
                    <div
                      key={hour}
                      onClick={() => handleSlotClick(day, hour)}
                      style={{ height: `${HOUR_HEIGHT}px` }}
                      className="border-b border-gray-100 dark:border-gray-800/60 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 cursor-pointer transition-colors relative group"
                    >
                      {/* Subtle half-hour dashed line */}
                      <div className="absolute top-1/2 left-0 right-0 border-b border-dashed border-gray-50 dark:border-gray-800/30 pointer-events-none" />
                    </div>
                  ))}

                  {/* Render Day's Events */}
                  {dayEvents.map((ev) => (
                    <EventBlock
                      key={ev.id}
                      title={ev.title}
                      start={ev.start}
                      end={ev.end}
                      isFixedAcademic={ev.isFixedAcademic}
                      subject={subjectMap.get(ev.subjectId)}
                      task={ev.task}
                      location={ev.location}
                      top={ev.top}
                      height={ev.height}
                      leftOffsetPercent={ev.leftOffsetPercent}
                      widthPercent={ev.widthPercent}
                      onClick={() => {
                        if (ev.task) {
                          openTaskModal(ev.task);
                        }
                      }}
                      onToggleComplete={() => {
                        if (ev.task) {
                          toggleTaskComplete(ev.task.id);
                        }
                      }}
                      allTasks={tasks}
                    />
                  ))}

                  {/* Red Current Time Line with Indicator Dot (if Today) */}
                  {isDayToday && isCurrentTimeVisible && (
                    <div
                      style={{ top: `${currentTimeTop}px` }}
                      className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-xs -ml-1.25 animate-pulse" />
                      <div className="flex-1 h-[2px] bg-red-500" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
