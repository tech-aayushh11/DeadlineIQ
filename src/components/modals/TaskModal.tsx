import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Calendar as CalendarIcon,
  Flag,
  BookOpen,
  CheckCircle2,
  Sliders,
  Sparkles,
  AlertCircle,
  Plus,
  Trash
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, Priority, TaskStatus, SchedulePreference, Subtask } from '../../types/task';

export const TaskModal: React.FC = () => {
  const {
    isTaskModalOpen,
    closeTaskModal,
    editingTask,
    defaultTimeSlot,
    addTask,
    updateTask,
    subjects,
    timetable,
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || 'sub-py');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [difficulty, setDifficulty] = useState<'easy' | 'moderate' | 'hard' | 'very_hard'>('moderate');
  const [hardDeadline, setHardDeadline] = useState(false);
  const [autoScheduled, setAutoScheduled] = useState(true);
  const [schedulePreference, setSchedulePreference] = useState<SchedulePreference>('evening_study');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Prefill when opened
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setSubjectId(editingTask.subjectId);
      setDurationMinutes(editingTask.durationMinutes);
      // Format YYYY-MM-DDTHH:mm
      setDueDate(editingTask.dueDate.slice(0, 16));
      setPriority(editingTask.priority);
      setStatus(editingTask.status);
      setDifficulty(editingTask.difficulty);
      setHardDeadline(editingTask.hardDeadline);
      setAutoScheduled(editingTask.autoScheduled);
      setSchedulePreference(editingTask.schedulePreference);
      setSubtasks(editingTask.subtasks || []);
    } else {
      // New task default
      setTitle('');
      setDescription('');
      setSubjectId(subjects[0]?.id || 'sub-py');
      setDurationMinutes(45);
      
      const targetDate = defaultTimeSlot ? new Date(defaultTimeSlot.start) : new Date();
      if (!defaultTimeSlot) {
        targetDate.setDate(targetDate.getDate() + 2);
        targetDate.setHours(18, 0, 0, 0);
      }
      setDueDate(targetDate.toISOString().slice(0, 16));
      setPriority('medium');
      setStatus('todo');
      setDifficulty('moderate');
      setHardDeadline(false);
      setAutoScheduled(true);
      setSchedulePreference('evening_study');
      setSubtasks([]);
    }
    setErrorMsg('');
  }, [editingTask, defaultTimeSlot, isTaskModalOpen, subjects]);

  if (!isTaskModalOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: `st-${Date.now()}`, title: newSubtaskTitle.trim(), completed: false },
    ]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Task name is required.');
      return;
    }
    if (!dueDate) {
      setErrorMsg('Please select a due date.');
      return;
    }

    let scheduledStart = editingTask?.scheduledStart;
    let scheduledEnd = editingTask?.scheduledEnd;

    // If defaultTimeSlot was clicked in the calendar, lock it to this slot
    if (!editingTask && defaultTimeSlot) {
      scheduledStart = defaultTimeSlot.start.toISOString();
      scheduledEnd = defaultTimeSlot.end.toISOString();
    }

    if (editingTask) {
      updateTask(editingTask.id, {
        title: title.trim(),
        description: description.trim(),
        subjectId,
        durationMinutes,
        dueDate: new Date(dueDate).toISOString(),
        priority,
        status,
        difficulty,
        hardDeadline,
        autoScheduled,
        schedulePreference,
        subtasks,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        subjectId,
        type: 'assignment',
        durationMinutes,
        dueDate: new Date(dueDate).toISOString(),
        priority,
        status,
        difficulty,
        importance: 4,
        progress: 0,
        hardDeadline,
        autoScheduled,
        scheduledStart,
        scheduledEnd,
        schedulePreference,
        subtasks,
      });
    }

    closeTaskModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-[#181a20] rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col text-xs select-none">
        {/* Motion Breadcrumb & Header */}
        <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-[#14161b]">
          <div className="flex items-center space-x-1.5 font-medium text-[11px]">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Tasks (RSCOE IT)</span>
            <span>&gt;</span>
            <span className="text-gray-800 dark:text-gray-200">
              {subjects.find((s) => s.id === subjectId)?.shortName || 'General'}
            </span>
          </div>

          <button
            onClick={closeTaskModal}
            className="p-1 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          {errorMsg && (
            <div className="flex items-center space-x-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-2 rounded border border-red-200 text-xs">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Task Name Input */}
          <div>
            <input
              type="text"
              placeholder="Task name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="w-full text-base font-semibold px-2 py-1 bg-transparent border-0 border-b border-transparent focus:border-blue-500 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <textarea
              placeholder="Description, notes, or lab objectives..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-[#13151a] border border-gray-200 dark:border-gray-800 rounded-md text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 resize-none text-xs"
            />
          </div>

          {/* Motion-style Compact Attribute Pills Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {/* Duration Selector */}
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Duration</span>
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-2 py-1.5 bg-gray-50 dark:bg-[#13151a] border border-gray-200 dark:border-gray-800 rounded-md text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500"
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
                <option value={180}>3 hours</option>
              </select>
            </div>

            {/* Subject Selector */}
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 flex items-center space-x-1">
                <BookOpen className="w-3 h-3" />
                <span>Subject</span>
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-2 py-1.5 bg-gray-50 dark:bg-[#13151a] border border-gray-200 dark:border-gray-800 rounded-md text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500 truncate"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.shortName} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Selector */}
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 flex items-center space-x-1">
                <Flag className="w-3 h-3" />
                <span>Priority</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-2 py-1.5 bg-gray-50 dark:bg-[#13151a] border border-gray-200 dark:border-gray-800 rounded-md text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500 capitalize"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Due Date & Time Picker */}
            <div className="col-span-2 sm:col-span-1">
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 flex items-center space-x-1">
                <CalendarIcon className="w-3 h-3" />
                <span>Due Date</span>
              </label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2 py-1 bg-gray-50 dark:bg-[#13151a] border border-gray-200 dark:border-gray-800 rounded-md text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Difficulty Selector */}
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 flex items-center space-x-1">
                <Sliders className="w-3 h-3" />
                <span>Difficulty</span>
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-2 py-1.5 bg-gray-50 dark:bg-[#13151a] border border-gray-200 dark:border-gray-800 rounded-md text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500 capitalize"
              >
                <option value="easy">Easy (0.9x)</option>
                <option value="moderate">Moderate (1.0x)</option>
                <option value="hard">Hard (1.25x)</option>
                <option value="very_hard">Very Hard (1.5x)</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Status</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-2 py-1.5 bg-gray-50 dark:bg-[#13151a] border border-gray-200 dark:border-gray-800 rounded-md text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500 capitalize"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Hard Deadline Toggle (From Screenshot 2) */}
          <div className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-[#13151a] border border-gray-200 dark:border-gray-800">
            <div className="flex flex-col">
              <span className="font-medium text-gray-800 dark:text-gray-200">Hard Deadline</span>
              <span className="text-[10px] text-gray-400">Strict college cutoff (cannot be pushed or delayed)</span>
            </div>
            <button
              type="button"
              onClick={() => setHardDeadline(!hardDeadline)}
              className={`w-9 h-5 rounded-full transition-colors relative flex items-center ${
                hardDeadline ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  hardDeadline ? 'translate-x-4.5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Subtasks Section */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-400">Subtasks</label>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {subtasks.map((st) => (
                <div key={st.id} className="flex items-center justify-between px-2 py-1 bg-gray-50 dark:bg-[#13151a] rounded border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => handleToggleSubtask(st.id)}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span className={`text-xs ${st.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      {st.title}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-1.5 pt-1">
              <input
                type="text"
                placeholder="+ Add subtask..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="flex-1 px-2 py-1 bg-transparent border border-dashed border-gray-300 dark:border-gray-700 rounded text-xs placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-200"
              >
                Add
              </button>
            </div>
          </div>

          {/* Bottom Action Bar matching Screenshot 2 */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            {/* Auto-scheduled Purple Toggle */}
            <button
              type="button"
              onClick={() => setAutoScheduled(!autoScheduled)}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md font-medium text-xs transition-colors ${
                autoScheduled
                  ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{autoScheduled ? '✦ Auto-scheduled' : 'Manual schedule'}</span>
            </button>

            {/* Cancel & Save Buttons */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={closeTaskModal}
                className="px-3 py-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
              >
                Cancel <span className="text-[10px] text-gray-400 font-mono">Esc</span>
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs"
              >
                {editingTask ? 'Save changes' : 'Create task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
