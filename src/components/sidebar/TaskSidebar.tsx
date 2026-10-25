import React, { useState, useMemo } from 'react';
import {
  Plus,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Filter,
  Check,
  Clock,
  Sparkles,
  Calendar,
  MoreVertical,
  Trash2,
  Edit2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types/task';
import { formatTime, formatDuration, isToday, isTaskOverdue, formatDateShort } from '../../utils/dateUtils';
import { calculateTaskRisk, getRiskBadgeClasses } from '../../utils/predictor';

export const TaskSidebar: React.FC = () => {
  const {
    tasks,
    subjects,
    toggleTaskComplete,
    openTaskModal,
    openRiskModal,
    deleteTask,
    selectedSubjectFilter,
    setSelectedSubjectFilter,
  } = useApp();

  // Collapsible groups state
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    completed: true, // completed collapsed by default
  });

  const [activeTab, setActiveTab] = useState<'all' | 'scheduled' | 'unscheduled'>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [menuTaskId, setMenuTaskId] = useState<string | null>(null);

  const toggleGroup = (groupKey: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  // Grouped tasks calculation
  const { overdueTasks, todayTasks, upcomingTasks, unscheduledTasks, completedTasks } = useMemo(() => {
    const overdue: Task[] = [];
    const today: Task[] = [];
    const upcoming: Task[] = [];
    const unscheduled: Task[] = [];
    const completed: Task[] = [];

    const filtered = tasks.filter((task) => {
      if (selectedSubjectFilter && task.subjectId !== selectedSubjectFilter) return false;
      if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
      if (searchFilter.trim() && !task.title.toLowerCase().includes(searchFilter.toLowerCase())) return false;
      if (activeTab === 'scheduled' && !task.scheduledStart) return false;
      if (activeTab === 'unscheduled' && task.scheduledStart) return false;
      return true;
    });

    filtered.forEach((task) => {
      if (task.status === 'completed') {
        completed.push(task);
        return;
      }

      if (isTaskOverdue(task.dueDate, false)) {
        overdue.push(task);
      } else if (!task.scheduledStart) {
        unscheduled.push(task);
      } else {
        const startDate = new Date(task.scheduledStart);
        if (isToday(startDate)) {
          today.push(task);
        } else {
          upcoming.push(task);
        }
      }
    });

    // Sort overdue by due date ascending
    overdue.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    today.sort((a, b) => new Date(a.scheduledStart || a.dueDate).getTime() - new Date(b.scheduledStart || b.dueDate).getTime());
    upcoming.sort((a, b) => new Date(a.scheduledStart || a.dueDate).getTime() - new Date(b.scheduledStart || b.dueDate).getTime());
    unscheduled.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    return { overdueTasks: overdue, todayTasks: today, upcomingTasks: upcoming, unscheduledTasks: unscheduled, completedTasks: completed };
  }, [tasks, selectedSubjectFilter, filterPriority, searchFilter, activeTab]);

  const subjectMap = useMemo(() => {
    const map = new Map<string, (typeof subjects)[0]>();
    subjects.forEach((s) => map.set(s.id, s));
    return map;
  }, [subjects]);

  const renderTaskItem = (task: Task) => {
    const subject = subjectMap.get(task.subjectId);
    const risk = calculateTaskRisk(task, tasks);
    const riskStyle = getRiskBadgeClasses(risk.riskLevel);
    const isDone = task.status === 'completed';

    return (
      <div
        key={task.id}
        className={`group relative flex items-start space-x-2 px-2.5 py-2 hover:bg-gray-100/70 dark:hover:bg-[#1a1d24] transition-colors border-b border-gray-100 dark:border-gray-800/60 text-xs ${
          isDone ? 'opacity-60' : ''
        }`}
      >
        {/* Checkbox circle matching Motion */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleTaskComplete(task.id);
          }}
          className={`w-3.5 h-3.5 mt-0.5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
            isDone
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-gray-400 dark:border-gray-600 hover:border-blue-500'
          }`}
        >
          {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
        </button>

        {/* Content Body */}
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => openTaskModal(task)}
        >
          <div className="flex items-center justify-between space-x-1">
            <span
              className={`font-medium truncate text-gray-800 dark:text-gray-200 ${
                isDone ? 'line-through text-gray-400 dark:text-gray-500' : ''
              }`}
            >
              {task.title}
            </span>
          </div>

          {/* Time, Subject, & Risk Metadata Row */}
          <div className="flex items-center flex-wrap gap-1.5 mt-1 text-[11px] text-gray-500 dark:text-gray-400">
            {/* Scheduled Time or Duration */}
            {task.scheduledStart ? (
              <span className="flex items-center space-x-0.5 text-blue-600 dark:text-blue-400 font-mono text-[10px]">
                <Clock className="w-2.5 h-2.5" />
                <span>
                  {formatTime(task.scheduledStart)} - {task.scheduledEnd ? formatTime(task.scheduledEnd) : ''}
                </span>
              </span>
            ) : (
              <span className="flex items-center space-x-0.5 text-gray-400 font-mono text-[10px]">
                <Calendar className="w-2.5 h-2.5" />
                <span>Due {formatDateShort(task.dueDate)}</span>
                <span>• {formatDuration(task.durationMinutes)}</span>
              </span>
            )}

            {/* Subject Pill */}
            {subject && (
              <span
                className="px-1.5 py-0.2 rounded text-[10px] font-medium shrink-0"
                style={{
                  backgroundColor: subject.badgeBg,
                  color: subject.color,
                }}
              >
                {subject.shortName}
              </span>
            )}

            {/* Risk Badge (Predictor Trigger) */}
            {!isDone && risk.riskLevel !== 'low' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openRiskModal(task);
                }}
                className={`flex items-center space-x-0.5 px-1 py-0.2 rounded text-[9px] font-semibold border ${riskStyle.bg} ${riskStyle.text} ${riskStyle.border} hover:opacity-85 transition-opacity`}
                title="Click to view smart deadline risk prediction breakdown"
              >
                <AlertTriangle className="w-2.5 h-2.5" />
                <span>{riskStyle.label}</span>
              </button>
            )}
          </div>
        </div>

        {/* Hover Action Menu */}
        <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 shrink-0">
          <button
            onClick={() => openTaskModal(task)}
            className="p-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Edit task"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
            title="Delete task"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  const renderGroup = (title: string, groupKey: string, groupTasks: Task[], badgeColor?: string) => {
    if (groupTasks.length === 0) return null;
    const isCollapsed = collapsedGroups[groupKey];

    return (
      <div key={groupKey} className="mb-2">
        <button
          onClick={() => toggleGroup(groupKey)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a1d24] uppercase tracking-wider select-none"
        >
          <div className="flex items-center space-x-1">
            {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            <span>{title}</span>
          </div>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              badgeColor || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            {groupTasks.length}
          </span>
        </button>

        {!isCollapsed && (
          <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
            {groupTasks.map((t) => renderTaskItem(t))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-72 lg:w-80 h-full border-r border-gray-200 dark:border-gray-800 bg-[#fbfbfc] dark:bg-[#14161b] flex flex-col select-none shrink-0 z-10">
      {/* Sidebar Header & Add Task Button */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-800 space-y-2">
        <button
          onClick={() => openTaskModal()}
          className="w-full py-1.5 px-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add task</span>
        </button>

        {/* Motion-style Status banner */}
        {overdueTasks.length > 0 ? (
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-xs">
            <div className="flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="font-medium">{overdueTasks.length} tasks past due</span>
            </div>
            <button
              onClick={() => {
                // Focus overdue group
                setCollapsedGroups((prev) => ({ ...prev, overdue: false }));
              }}
              className="text-[11px] underline font-semibold hover:text-amber-900 dark:hover:text-amber-100"
            >
              View
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium text-[11px]">All tasks scheduled on-time</span>
          </div>
        )}

        {/* Search & Filter Compact Bar */}
        <div className="flex items-center space-x-1.5">
          <input
            type="text"
            placeholder="Filter tasks..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="flex-1 px-2 py-1 bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 rounded text-xs placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
          />
          {/* Subject Filter selector */}
          <select
            value={selectedSubjectFilter || 'all'}
            onChange={(e) => setSelectedSubjectFilter(e.target.value === 'all' ? null : e.target.value)}
            className="px-2 py-1 bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 rounded text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:border-blue-500 max-w-[95px] truncate"
          >
            <option value="all">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.shortName}
              </option>
            ))}
          </select>
        </div>

        {/* Status Pill Filter */}
        <div className="flex rounded-md bg-gray-100 dark:bg-gray-800 p-0.5 text-[11px]">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-0.5 rounded text-center transition-colors font-medium ${
              activeTab === 'all' ? 'bg-white dark:bg-[#111317] text-gray-900 dark:text-white shadow-xs' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`flex-1 py-0.5 rounded text-center transition-colors font-medium ${
              activeTab === 'scheduled' ? 'bg-white dark:bg-[#111317] text-gray-900 dark:text-white shadow-xs' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Scheduled
          </button>
          <button
            onClick={() => setActiveTab('unscheduled')}
            className={`flex-1 py-0.5 rounded text-center transition-colors font-medium ${
              activeTab === 'unscheduled' ? 'bg-white dark:bg-[#111317] text-gray-900 dark:text-white shadow-xs' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Unscheduled
          </button>
        </div>
      </div>

      {/* Scrollable Grouped Task List */}
      <div className="flex-1 overflow-y-auto py-2">
        {renderGroup('Overdue', 'overdue', overdueTasks, 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300')}
        {renderGroup('Today', 'today', todayTasks, 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300')}
        {renderGroup('Upcoming', 'upcoming', upcomingTasks)}
        {renderGroup('Unscheduled', 'unscheduled', unscheduledTasks, 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300')}
        {renderGroup('Completed', 'completed', completedTasks, 'bg-gray-100 dark:bg-gray-800 text-gray-500')}

        {tasks.length === 0 && (
          <div className="p-8 text-center text-xs text-gray-400">
            No tasks found. Click "+ Add task" to schedule study sessions.
          </div>
        )}
      </div>

      {/* Sidebar Footer Info */}
      <div className="p-2.5 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111317] text-[11px] text-gray-500 dark:text-gray-400 flex items-center justify-between">
        <span className="flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-purple-500" />
          <span>Prediction Engine: Active</span>
        </span>
        <span className="font-mono">{tasks.filter((t) => t.status === 'completed').length}/{tasks.length} Done</span>
      </div>
    </aside>
  );
};
