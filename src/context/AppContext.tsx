import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task } from '../types/task';
import { Subject, StudentProfile } from '../types/subject';
import { AcademicCommitment, CalendarViewMode, AutoScheduleProposal } from '../types/calendar';
import { INITIAL_SUBJECTS, FIXED_COLLEGE_SCHEDULE, CURRENT_STUDENT } from '../data/academicData';
import { createSampleTasks } from '../data/initialTasks';
import { generateAutoScheduleProposals } from '../utils/scheduler';

interface AppContextType {
  tasks: Task[];
  subjects: Subject[];
  timetable: AcademicCommitment[];
  student: StudentProfile;
  selectedSubjectFilter: string | null;
  setSelectedSubjectFilter: (subId: string | null) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  calendarView: CalendarViewMode;
  setCalendarView: (view: CalendarViewMode) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // Modals
  isTaskModalOpen: boolean;
  openTaskModal: (task?: Task | null, defaultSlot?: { start: Date; end: Date }) => void;
  closeTaskModal: () => void;
  editingTask: Task | null;
  defaultTimeSlot: { start: Date; end: Date } | null;

  isRiskModalOpen: boolean;
  openRiskModal: (task: Task) => void;
  closeRiskModal: () => void;
  selectedRiskTask: Task | null;

  isAutoScheduleModalOpen: boolean;
  openAutoScheduleModal: () => void;
  closeAutoScheduleModal: () => void;
  autoScheduleProposals: AutoScheduleProposal[];
  unschedulableTasks: Task[];
  applyProposals: (proposals: AutoScheduleProposal[]) => void;

  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;

  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  rescheduleTask: (id: string, newStart: string, newEnd: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_TASKS = 'deadlineiq_tasks_v1';
const STORAGE_KEY_THEME = 'deadlineiq_theme_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved !== null) return saved === 'dark';
    return false; // default light theme matching Motion screenshot
  });

  // Apply dark class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Core data states
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TASKS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved tasks', e);
      }
    }
    return createSampleTasks();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  }, [tasks]);

  const [subjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [timetable] = useState<AcademicCommitment[]>(FIXED_COLLEGE_SCHEDULE);
  const [student] = useState<StudentProfile>(CURRENT_STUDENT);

  // Calendar & navigation states
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<CalendarViewMode>('week');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultTimeSlot, setDefaultTimeSlot] = useState<{ start: Date; end: Date } | null>(null);

  const [isRiskModalOpen, setIsRiskModalOpen] = useState<boolean>(false);
  const [selectedRiskTask, setSelectedRiskTask] = useState<Task | null>(null);

  const [isAutoScheduleModalOpen, setIsAutoScheduleModalOpen] = useState<boolean>(false);
  const [autoScheduleProposals, setAutoScheduleProposals] = useState<AutoScheduleProposal[]>([]);
  const [unschedulableTasks, setUnschedulableTasks] = useState<Task[]>([]);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  // Modal actions
  const openTaskModal = (task?: Task | null, defaultSlot?: { start: Date; end: Date }) => {
    setEditingTask(task || null);
    setDefaultTimeSlot(defaultSlot || null);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setDefaultTimeSlot(null);
  };

  const openRiskModal = (task: Task) => {
    setSelectedRiskTask(task);
    setIsRiskModalOpen(true);
  };

  const closeRiskModal = () => {
    setIsRiskModalOpen(false);
    setSelectedRiskTask(null);
  };

  const openAutoScheduleModal = () => {
    const { proposals, unschedulableTasks: unsched } = generateAutoScheduleProposals(
      tasks,
      timetable,
      selectedDate
    );
    setAutoScheduleProposals(proposals);
    setUnschedulableTasks(unsched);
    setIsAutoScheduleModalOpen(true);
  };

  const closeAutoScheduleModal = () => {
    setIsAutoScheduleModalOpen(false);
  };

  const applyProposals = (proposals: AutoScheduleProposal[]) => {
    setTasks((prev) =>
      prev.map((t) => {
        const prop = proposals.find((p) => p.taskId === t.id);
        if (prop) {
          return {
            ...t,
            scheduledStart: prop.proposedStart,
            scheduledEnd: prop.proposedEnd,
            autoScheduled: true,
          };
        }
        return t;
      })
    );
    closeAutoScheduleModal();
  };

  // Task operations
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isComp = t.status === 'completed';
          return {
            ...t,
            status: isComp ? 'todo' : 'completed',
            progress: isComp ? 0 : 100,
            completedAt: isComp ? undefined : new Date().toISOString(),
          };
        }
        return t;
      })
    );
  };

  const rescheduleTask = (id: string, newStart: string, newEnd: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              scheduledStart: newStart,
              scheduledEnd: newEnd,
              autoScheduled: false, // user manually moved it
            }
          : t
      )
    );
  };

  const resetAllData = () => {
    const samples = createSampleTasks();
    setTasks(samples);
    localStorage.removeItem(STORAGE_KEY_TASKS);
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        subjects,
        timetable,
        student,
        selectedSubjectFilter,
        setSelectedSubjectFilter,
        selectedDate,
        setSelectedDate,
        calendarView,
        setCalendarView,
        isDarkMode,
        toggleDarkMode,
        searchQuery,
        setSearchQuery,
        isTaskModalOpen,
        openTaskModal,
        closeTaskModal,
        editingTask,
        defaultTimeSlot,
        isRiskModalOpen,
        openRiskModal,
        closeRiskModal,
        selectedRiskTask,
        isAutoScheduleModalOpen,
        openAutoScheduleModal,
        closeAutoScheduleModal,
        autoScheduleProposals,
        unschedulableTasks,
        applyProposals,
        isSearchModalOpen,
        setIsSearchModalOpen,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        rescheduleTask,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
