import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  CheckSquare,
  BookOpen,
  BarChart2,
  Sparkles,
  TrendingUp,
  Settings,
  Search,
  Plus,
  Sun,
  Moon,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopNav: React.FC = () => {
  const {
    student,
    isDarkMode,
    toggleDarkMode,
    openTaskModal,
    openAutoScheduleModal,
    setIsSearchModalOpen,
  } = useApp();

  const navLinks = [
    { to: '/', label: 'Calendar', icon: CalendarIcon },
    { to: '/tasks', label: 'Tasks', icon: CheckSquare },
    { to: '/subjects', label: 'Subjects', icon: BookOpen },
    { to: '/workload', label: 'Workload', icon: BarChart2 },
    { to: '/predictor', label: 'Predictor', icon: Sparkles },
    { to: '/analytics', label: 'Analytics', icon: TrendingUp },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="h-12 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111317] px-3 flex items-center justify-between text-xs select-none z-20 shrink-0">
      {/* Left: Wordmark / Logo & Main Navigation Tabs */}
      <div className="flex items-center space-x-5">
        <NavLink to="/" className="flex items-center space-x-2 text-gray-900 dark:text-white font-semibold text-sm tracking-tight mr-1">
          <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold shadow-xs">
            IQ
          </div>
          <span className="flex items-center font-bold">
            Deadline<span className="text-blue-600 dark:text-blue-400">IQ</span>
          </span>
        </NavLink>

        <nav className="flex items-center space-x-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2">
        {/* Quick Search Shortcut */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="flex items-center space-x-1.5 px-2 py-1 rounded bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700/80 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
          title="Search tasks, subjects, resources (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="text-[11px] hidden sm:inline">Search</span>
          <kbd className="text-[10px] bg-white dark:bg-gray-900 px-1 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-gray-400">
            ⌘K
          </kbd>
        </button>

        {/* Auto-Schedule Trigger Button */}
        <button
          onClick={openAutoScheduleModal}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800/50 transition-colors font-medium"
          title="Auto-Schedule unscheduled tasks"
        >
          <Clock className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Auto-Schedule</span>
        </button>

        {/* Add Task Primary Button (Motion blue style) */}
        <button
          onClick={() => openTaskModal()}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add task</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Student Profile Pill */}
        <div className="flex items-center space-x-2 pl-1 border-l border-gray-200 dark:border-gray-800">
          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-[10px]">
            {student.name.charAt(0)}
          </div>
          <div className="hidden lg:block text-left leading-tight">
            <div className="text-[11px] font-medium text-gray-800 dark:text-gray-200">{student.name}</div>
            <div className="text-[9px] text-gray-400 dark:text-gray-500">RSCOE IT • Sem 1</div>
          </div>
        </div>
      </div>
    </header>
  );
};
