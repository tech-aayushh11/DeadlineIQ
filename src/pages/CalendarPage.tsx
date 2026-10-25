import React from 'react';
import { useApp } from '../context/AppContext';
import { TaskSidebar } from '../components/sidebar/TaskSidebar';
import { CalendarHeader } from '../components/calendar/CalendarHeader';
import { WeekView } from '../components/calendar/WeekView';
import { DayView } from '../components/calendar/DayView';
import { MonthView } from '../components/calendar/MonthView';

export const CalendarPage: React.FC = () => {
  const { calendarView } = useApp();

  return (
    <div className="flex-1 flex overflow-hidden w-full h-full">
      {/* Left Panel: Motion Task Sidebar */}
      <TaskSidebar />

      {/* Right Panel: Centerpiece Interactive Calendar */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#111317]">
        <CalendarHeader />
        <div className="flex-1 flex overflow-hidden">
          {calendarView === 'week' && <WeekView />}
          {calendarView === 'day' && <DayView />}
          {calendarView === 'month' && <MonthView />}
        </div>
      </div>
    </div>
  );
};
