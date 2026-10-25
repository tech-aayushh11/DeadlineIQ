import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getWeekDays, isSameDay } from '../utils/dateUtils';
import { Task } from '../types/task';
import { AcademicCommitment } from '../types/calendar';
import { Subject } from '../types/subject';

const MAX_SAFE_DAILY_HOURS = 5.0; // RSCOE student maximum sustainable daily study capacity

export const WorkloadPage: React.FC = () => {
  const { tasks, timetable, subjects, selectedDate, openAutoScheduleModal } = useApp();

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);

  // Daily workload distribution
  const dailyData = useMemo(() => {
    return weekDays.map((day: Date) => {
      const dayName = day.toLocaleDateString([], { weekday: 'short' });
      const dateStr = day.toLocaleDateString([], { month: 'short', day: 'numeric' });

      // Calculate study task hours on this day
      let taskHours = 0;
      tasks.forEach((t: Task) => {
        if (t.status === 'completed') return;
        const target = t.scheduledStart ? new Date(t.scheduledStart) : new Date(t.dueDate);
        if (isSameDay(target, day)) {
          taskHours += t.durationMinutes / 60;
        }
      });

      // Calculate fixed college commitment hours
      const dayOfWeek = day.getDay();
      let lectureHours = 0;
      timetable.forEach((c: AcademicCommitment) => {
        if (c.dayOfWeek === dayOfWeek) {
          const [sh, sm] = c.startTime.split(':').map(Number);
          const [eh, em] = c.endTime.split(':').map(Number);
          lectureHours += (eh - sh) + (em - sm) / 60;
        }
      });

      const totalWorkload = Number((taskHours + lectureHours).toFixed(1));
      const isOverloaded = taskHours > MAX_SAFE_DAILY_HOURS;

      return {
        name: dayName,
        date: dateStr,
        StudyHours: Number(taskHours.toFixed(1)),
        CollegeHours: Number(lectureHours.toFixed(1)),
        totalWorkload,
        isOverloaded,
      };
    });
  }, [weekDays, tasks, timetable]);

  // Subject workload distribution for pie chart
  const subjectDistribution = useMemo(() => {
    const map = new Map<string, number>();
    tasks.forEach((t: Task) => {
      if (t.status === 'completed') return;
      const cur = map.get(t.subjectId) || 0;
      map.set(t.subjectId, cur + t.durationMinutes / 60);
    });

    return subjects
      .map((s: Subject) => ({
        name: s.shortName,
        hours: Number((map.get(s.id) || 0).toFixed(1)),
        color: s.color,
      }))
      .filter((s) => s.hours > 0);
  }, [tasks, subjects]);

  const totalWeeklyStudyHours = dailyData.reduce((acc, d) => acc + d.StudyHours, 0);
  const overloadedDaysCount = dailyData.filter((d) => d.isOverloaded).length;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fbfbfc] dark:bg-[#111317] overflow-y-auto select-none p-6">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        {/* Page Title & Auto-Schedule Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Weekly Workload & Capacity Analysis</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Tracking academic commitments vs sustainable independent study capacity
            </p>
          </div>

          <button
            onClick={openAutoScheduleModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Balance Schedule with AI</span>
          </button>
        </div>

        {/* Capacity Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181a20] shadow-2xs">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Total Weekly Study Load
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1 font-mono">
              {totalWeeklyStudyHours.toFixed(1)} <span className="text-xs font-normal text-gray-400">hours</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1 flex items-center space-x-1">
              <Clock className="w-3 h-3 text-blue-500" />
              <span>Avg {(totalWeeklyStudyHours / 7).toFixed(1)}h / day</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181a20] shadow-2xs">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Max Daily Threshold
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1 font-mono">
              {MAX_SAFE_DAILY_HOURS} <span className="text-xs font-normal text-gray-400">hours/day</span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Recommended engineering limit</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181a20] shadow-2xs">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Capacity Status
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1 font-mono">
              {overloadedDaysCount === 0 ? 'Optimal' : `${overloadedDaysCount} Days Peak`}
            </div>
            <div className={`text-[11px] mt-1 flex items-center space-x-1 ${
              overloadedDaysCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {overloadedDaysCount > 0 ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
              <span>{overloadedDaysCount > 0 ? 'Requires task redistribution' : 'Balanced distribution'}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181a20] shadow-2xs">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Fixed Timetable Load
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1 font-mono">
              21.5 <span className="text-xs font-normal text-gray-400">hrs/week</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              Lectures, Labs & Tutorials at RSCOE
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Workload Bar Chart */}
          <div className="lg:col-span-2 p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181a20] shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Daily Workload Breakdown (Hours)
                </h3>
                <p className="text-[11px] text-gray-400">
                  Comparing study tasks (purple) against fixed college lectures (blue)
                </p>
              </div>

              <div className="flex items-center space-x-3 text-[11px]">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded bg-blue-600" />
                  <span className="text-gray-600 dark:text-gray-400">College Lectures</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded bg-purple-600" />
                  <span className="text-gray-600 dark:text-gray-400">Study Tasks</span>
                </span>
              </div>
            </div>

            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      borderColor: '#374151',
                      borderRadius: '8px',
                      color: '#f9fafb',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="CollegeHours" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="StudyHours" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subject Distribution Donut */}
          <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181a20] shadow-2xs flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Study Load by Subject
              </h3>
              <p className="text-[11px] text-gray-400 mb-4">
                Distribution of pending assignments & prep
              </p>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={subjectDistribution}
                      dataKey="hours"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                    >
                      {subjectDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Subject Legend List */}
            <div className="space-y-1.5 mt-2 border-t border-gray-100 dark:border-gray-800 pt-3">
              {subjectDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center space-x-1.5 truncate">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-700 dark:text-gray-300 truncate">{item.name}</span>
                  </div>
                  <span className="font-mono text-gray-500">{item.hours}h</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
