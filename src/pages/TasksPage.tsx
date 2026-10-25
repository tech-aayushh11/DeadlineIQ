import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Check,
  Clock,
  Calendar,
  AlertTriangle,
  Trash2,
  Edit2,
  Sparkles,
  ArrowUpDown,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Task, Priority, TaskStatus } from '../types/task';
import { formatFullDate, formatDuration, isTaskOverdue, formatDateShort } from '../utils/dateUtils';
import { calculateTaskRisk, getRiskBadgeClasses } from '../utils/predictor';

export const TasksPage: React.FC = () => {
  const {
    tasks,
    subjects,
    openTaskModal,
    openRiskModal,
    toggleTaskComplete,
    deleteTask,
    openAutoScheduleModal,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'due' | 'risk' | 'duration'>('due');

  const subjectMap = useMemo(() => new Map(subjects.map((s) => [s.id, s])), [subjects]);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (selectedSubject !== 'all' && t.subjectId !== selectedSubject) return false;
        if (selectedStatus !== 'all' && t.status !== selectedStatus) return false;
        if (selectedPriority !== 'all' && t.priority !== selectedPriority) return false;
        if (search.trim() && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'due') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (sortBy === 'risk') {
          const riskA = calculateTaskRisk(a, tasks).score;
          const riskB = calculateTaskRisk(b, tasks).score;
          return riskB - riskA;
        }
        if (sortBy === 'duration') {
          return b.durationMinutes - a.durationMinutes;
        }
        return 0;
      });
  }, [tasks, selectedSubject, selectedStatus, selectedPriority, search, sortBy]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fbfbfc] dark:bg-[#111317] overflow-hidden select-none">
      {/* Top Filter and Actions Bar */}
      <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14161b] flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center space-x-3 flex-1 min-w-[260px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search all tasks & assignments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 rounded-md placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-50 dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300"
          >
            <option value="all">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.shortName}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-50 dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 capitalize"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 bg-gray-50 dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300"
          >
            <option value="due">Sort by Due Date</option>
            <option value="risk">Sort by Deadline Risk</option>
            <option value="duration">Sort by Duration</option>
          </select>
        </div>

        {/* Right buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={openAutoScheduleModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-medium hover:bg-purple-100"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Schedule Unscheduled</span>
          </button>

          <button
            onClick={() => openTaskModal()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Tasks Table List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto bg-white dark:bg-[#181a20] rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-3 px-4 py-2.5 bg-gray-50 dark:bg-[#14161b] border-b border-gray-200 dark:border-gray-800 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-4 flex items-center space-x-2">
              <span>Task Title</span>
            </div>
            <div className="col-span-2">Subject</div>
            <div className="col-span-2">Due Date</div>
            <div className="col-span-1">Duration</div>
            <div className="col-span-2">Predictor Risk</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-100 dark:divide-gray-800/60 text-xs">
            {filteredTasks.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                No matching tasks found.
              </div>
            ) : (
              filteredTasks.map((task) => {
                const sub = subjectMap.get(task.subjectId);
                const risk = calculateTaskRisk(task, tasks);
                const riskStyle = getRiskBadgeClasses(risk.riskLevel);
                const isDone = task.status === 'completed';
                const isOverdue = isTaskOverdue(task.dueDate, isDone);

                return (
                  <div
                    key={task.id}
                    className={`grid grid-cols-12 gap-3 px-4 py-3 items-center hover:bg-gray-50/70 dark:hover:bg-[#1d2027] transition-colors ${
                      isDone ? 'opacity-60 bg-gray-50/30' : ''
                    }`}
                  >
                    {/* Checkbox + Title */}
                    <div className="col-span-4 flex items-center space-x-2.5 min-w-0">
                      <button
                        onClick={() => toggleTaskComplete(task.id)}
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          isDone
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
                        }`}
                      >
                        {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </button>
                      <div className="min-w-0">
                        <span
                          onClick={() => openTaskModal(task)}
                          className={`font-semibold cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 truncate block text-gray-900 dark:text-gray-100 ${
                            isDone ? 'line-through text-gray-400' : ''
                          }`}
                        >
                          {task.title}
                        </span>
                        {task.hardDeadline && (
                          <span className="text-[10px] text-red-600 dark:text-red-400 font-medium">
                            • Hard Deadline
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="col-span-2 truncate">
                      {sub && (
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-medium"
                          style={{ backgroundColor: sub.badgeBg, color: sub.color }}
                        >
                          {sub.shortName}
                        </span>
                      )}
                    </div>

                    {/* Due Date */}
                    <div className="col-span-2 font-mono text-[11px] text-gray-600 dark:text-gray-300">
                      <div className={isOverdue ? 'text-red-600 dark:text-red-400 font-semibold' : ''}>
                        {formatDateShort(task.dueDate)}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {isOverdue ? 'Overdue!' : 'On schedule'}
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="col-span-1 font-mono text-gray-600 dark:text-gray-400">
                      {formatDuration(task.durationMinutes)}
                    </div>

                    {/* Predictor Risk Badge */}
                    <div className="col-span-2">
                      <button
                        onClick={() => openRiskModal(task)}
                        className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded border text-[10px] font-semibold transition-opacity hover:opacity-85 ${riskStyle.bg} ${riskStyle.text} ${riskStyle.border}`}
                      >
                        {risk.riskLevel !== 'low' && <AlertTriangle className="w-3 h-3" />}
                        <span>{riskStyle.label}</span>
                        <span className="opacity-75 font-mono">({risk.score}%)</span>
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => openTaskModal(task)}
                        className="p-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Edit task"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
