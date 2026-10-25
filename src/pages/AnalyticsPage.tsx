import React, { useMemo } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Target,
  Award,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnalyticsPage: React.FC = () => {
  const { tasks, subjects } = useApp();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const pendingTasks = tasks.filter((t) => t.status === 'todo');

  const onTimeRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const totalEstimatedHours = Number((tasks.reduce((sum, t) => sum + t.durationMinutes, 0) / 60).toFixed(1));
  const completedHours = Number((completedTasks.reduce((sum, t) => sum + t.durationMinutes, 0) / 60).toFixed(1));

  const subjectBreakdown = useMemo(() => {
    return subjects.map((sub) => {
      const subTasks = tasks.filter((t) => t.subjectId === sub.id);
      const done = subTasks.filter((t) => t.status === 'completed').length;
      return {
        subject: sub,
        total: subTasks.length,
        done,
        rate: subTasks.length > 0 ? Math.round((done / subTasks.length) * 100) : 0,
      };
    });
  }, [tasks, subjects]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fbfbfc] dark:bg-[#111317] overflow-y-auto select-none p-6">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>Productivity & Completion Analytics</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Personal performance tracking for RSCOE Semester 1 academic deliverables
          </p>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181a20] shadow-2xs">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Completion Rate
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1 font-mono">
              {onTimeRate}%
            </div>
            <div className="text-[11px] text-gray-500 mt-1 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>{completedTasks.length} of {totalTasks} tasks submitted</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181a20] shadow-2xs">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Completed Study Hours
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1 font-mono">
              {completedHours} <span className="text-xs font-normal text-gray-400">/ {totalEstimatedHours}h</span>
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{((completedHours / Math.max(totalEstimatedHours, 1)) * 100).toFixed(0)}% effort completed</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181a20] shadow-2xs">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              In-Progress Work
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1 font-mono">
              {inProgressTasks.length} <span className="text-xs font-normal text-gray-400">active</span>
            </div>
            <div className="text-[11px] text-purple-600 dark:text-purple-400 mt-1">
              {pendingTasks.length} queued in backlog
            </div>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181a20] shadow-2xs">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Study Focus Streak
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1 font-mono">
              5 Days
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 flex items-center space-x-1">
              <Award className="w-3 h-3" />
              <span>On-track for mid-sem prep</span>
            </div>
          </div>
        </div>

        {/* Subject-Wise Completion Progress */}
        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181a20] shadow-2xs">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
            Subject-Wise Assignment & Lab Progress
          </h3>

          <div className="space-y-4">
            {subjectBreakdown.map(({ subject, total, done, rate }) => (
              <div key={subject.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: subject.color }}
                    />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {subject.name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">({subject.code})</span>
                  </div>
                  <span className="font-mono text-gray-500 text-[11px]">
                    {done} / {total} tasks ({rate}%)
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${rate}%`,
                      backgroundColor: subject.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
