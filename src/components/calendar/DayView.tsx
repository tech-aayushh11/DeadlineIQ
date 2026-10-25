import React, { useRef, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EventBlock } from './EventBlock';
import { isToday, isSameDay, formatFullDate } from '../../utils/dateUtils';
import { Task } from '../../types/task';
import { AcademicCommitment } from '../../types/calendar';

const START_HOUR = 7;
const END_HOUR = 23;
const TOTAL_HOURS = END_HOUR - START_HOUR;
const HOUR_HEIGHT = 60; // Slightly more spacious for single-day focus
const MINUTE_HEIGHT = HOUR_HEIGHT / 60;

export const DayView: React.FC = () => {
  const {
    selectedDate,
    tasks,
    timetable,
    subjects,
    selectedSubjectFilter,
    openTaskModal,
    toggleTaskComplete,
  } = useApp();

  const scrollRef = useRef<HTMLDivElement>(null);

  const subjectMap = useMemo(() => {
    const map = new Map<string, (typeof subjects)[0]>();
    subjects.forEach((s) => map.set(s.id, s));
    return map;
  }, [subjects]);

  useEffect(() => {
    if (scrollRef.current) {
      const targetScroll = (8.5 - START_HOUR) * HOUR_HEIGHT;
      scrollRef.current.scrollTop = Math.max(0, targetScroll);
    }
  }, []);

  const now = new Date();
  const isSelectedToday = isToday(selectedDate);
  const currentMinutesFromStart = (now.getHours() - START_HOUR) * 60 + now.getMinutes();
  const currentTimeTop = currentMinutesFromStart * MINUTE_HEIGHT;
  const isCurrentTimeVisible = isSelectedToday && now.getHours() >= START_HOUR && now.getHours() < END_HOUR;

  const dayEvents = useMemo(() => {
    const events: any[] = [];

    // Scheduled tasks
    tasks.forEach((task) => {
      if (!task.scheduledStart || !task.scheduledEnd) return;
      if (selectedSubjectFilter && task.subjectId !== selectedSubjectFilter) return;

      const start = new Date(task.scheduledStart);
      const end = new Date(task.scheduledEnd);

      if (isSameDay(start, selectedDate)) {
        const startMin = (start.getHours() - START_HOUR) * 60 + start.getMinutes();
        const durationMin = Math.max(25, (end.getTime() - start.getTime()) / (1000 * 60));

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

    // Academic commitments
    const dayOfWeek = selectedDate.getDay();
    timetable.forEach((commitment: AcademicCommitment) => {
      if (commitment.dayOfWeek === dayOfWeek) {
        if (selectedSubjectFilter && commitment.subjectId !== selectedSubjectFilter) return;

        const [sh, sm] = commitment.startTime.split(':').map(Number);
        const [eh, em] = commitment.endTime.split(':').map(Number);

        const start = new Date(selectedDate);
        start.setHours(sh, sm, 0, 0);
        const end = new Date(selectedDate);
        end.setHours(eh, em, 0, 0);

        const startMin = (sh - START_HOUR) * 60 + sm;
        const durationMin = (eh - sh) * 60 + (em - sm);

        if (startMin >= 0 && startMin < TOTAL_HOURS * 60) {
          events.push({
            id: `academic-${commitment.id}`,
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

    events.sort((a, b) => a.top - b.top);

    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        if (events[j].top < events[i].top + events[i].height - 2) {
          events[i].widthPercent = 48;
          events[j].widthPercent = 48;
          events[j].leftOffsetPercent = 50;
        }
      }
    }

    return events;
  }, [selectedDate, tasks, timetable, selectedSubjectFilter]);

  const hoursArray = Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i);

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#111317] overflow-hidden select-none">
      {/* Day Header */}
      <div className="px-6 py-2.5 border-b border-gray-200 dark:border-gray-800 bg-[#fcfcfd] dark:bg-[#14161b] flex items-center justify-between shrink-0">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {formatFullDate(selectedDate)}
        </h2>
        <span className="text-xs text-gray-400">
          {dayEvents.length} scheduled items
        </span>
      </div>

      {/* Day Time Grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto relative">
        <div className="flex relative" style={{ height: `${TOTAL_HOURS * HOUR_HEIGHT}px` }}>
          {/* Time axis */}
          <div className="w-16 shrink-0 border-r border-gray-200 dark:border-gray-800">
            {hoursArray.map((hour) => {
              const displayHour = hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`;
              return (
                <div
                  key={hour}
                  style={{ height: `${HOUR_HEIGHT}px` }}
                  className="relative text-right pr-3 text-[11px] font-mono text-gray-400"
                >
                  <span className="-top-2.5 relative">{displayHour}</span>
                </div>
              );
            })}
          </div>

          {/* Time slot column */}
          <div className="flex-1 relative">
            {hoursArray.map((hour) => (
              <div
                key={hour}
                onClick={() => {
                  const start = new Date(selectedDate);
                  start.setHours(hour, 0, 0, 0);
                  const end = new Date(selectedDate);
                  end.setHours(hour + 1, 0, 0, 0);
                  openTaskModal(null, { start, end });
                }}
                style={{ height: `${HOUR_HEIGHT}px` }}
                className="border-b border-gray-100 dark:border-gray-800/60 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 cursor-pointer relative"
              />
            ))}

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
                  if (ev.task) openTaskModal(ev.task);
                }}
                onToggleComplete={() => {
                  if (ev.task) toggleTaskComplete(ev.task.id);
                }}
                allTasks={tasks}
              />
            ))}

            {isCurrentTimeVisible && (
              <div
                style={{ top: `${currentTimeTop}px` }}
                className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-xs -ml-1.25 animate-pulse" />
                <div className="flex-1 h-[2px] bg-red-500" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
