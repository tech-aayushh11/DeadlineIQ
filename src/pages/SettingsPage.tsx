import React, { useState } from 'react';
import {
  Settings,
  GraduationCap,
  Moon,
  Sun,
  RotateCcw,
  Download,
  CheckCircle,
  Sliders,
  Save
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { student, isDarkMode, toggleDarkMode, resetAllData, tasks } = useApp();
  const [dailyCapacity, setDailyCapacity] = useState('5.0');
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  const handleSave = () => {
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 2500);
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'deadlineiq_tasks_export.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fbfbfc] dark:bg-[#111317] overflow-y-auto select-none p-6">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Settings className="w-4 h-4 text-blue-600" />
            <span>Application Settings & Academic Configuration</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Configure institutional profile, auto-scheduling constraints, and visual preferences
          </p>
        </div>

        {showSavedNotification && (
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Preferences saved successfully!</span>
          </div>
        )}

        {/* Student Profile Info */}
        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181a20] shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>Student & Institution Credentials</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400">Student Name</label>
              <input
                type="text"
                disabled
                value={student.name}
                className="w-full mt-1 px-3 py-1.5 bg-gray-50 dark:bg-[#13151a] border border-gray-200 dark:border-gray-800 rounded-md text-gray-700 dark:text-gray-300"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400">PRN (Permanent Registration No)</label>
              <input
                type="text"
                disabled
                value={student.prn}
                className="w-full mt-1 px-3 py-1.5 bg-gray-50 dark:bg-[#13151a] border border-gray-200 dark:border-gray-800 rounded-md text-gray-700 dark:text-gray-300 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] uppercase font-bold text-gray-400">Institution</label>
              <input
                type="text"
                disabled
                value={student.institution}
                className="w-full mt-1 px-3 py-1.5 bg-gray-50 dark:bg-[#13151a] border border-gray-200 dark:border-gray-800 rounded-md text-gray-700 dark:text-gray-300"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400">Program & Branch</label>
              <input
                type="text"
                disabled
                value={student.program}
                className="w-full mt-1 px-3 py-1.5 bg-gray-50 dark:bg-[#13151a] border border-gray-200 dark:border-gray-800 rounded-md text-gray-700 dark:text-gray-300"
              />
            </div>

            <div className="flex space-x-3">
              <div className="flex-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Academic Year</label>
                <input
                  type="text"
                  disabled
                  value={student.academicYear}
                  className="w-full mt-1 px-3 py-1.5 bg-gray-50 dark:bg-[#13151a] border border-gray-200 dark:border-gray-800 rounded-md text-gray-700 dark:text-gray-300"
                />
              </div>
              <div className="w-20">
                <label className="text-[10px] uppercase font-bold text-gray-400">Semester</label>
                <input
                  type="text"
                  disabled
                  value={`Sem ${student.semester}`}
                  className="w-full mt-1 px-3 py-1.5 bg-gray-50 dark:bg-[#13151a] border border-gray-200 dark:border-gray-800 rounded-md text-gray-700 dark:text-gray-300 text-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scheduling Preferences */}
        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181a20] shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <Sliders className="w-4 h-4 text-purple-600" />
            <span>Auto-Scheduler Parameters</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400">
                Target Daily Study Capacity
              </label>
              <select
                value={dailyCapacity}
                onChange={(e) => setDailyCapacity(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 bg-gray-50 dark:bg-[#13151a] border border-gray-200 dark:border-gray-800 rounded-md text-gray-800 dark:text-gray-200"
              >
                <option value="4.0">4.0 hours / day (Moderate)</option>
                <option value="5.0">5.0 hours / day (Recommended)</option>
                <option value="6.0">6.0 hours / day (High intensity)</option>
                <option value="7.0">7.0 hours / day (Exam season)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400">
                Preferred Weekday Slot
              </label>
              <select
                defaultValue="evening"
                className="w-full mt-1 px-3 py-1.5 bg-gray-50 dark:bg-[#13151a] border border-gray-200 dark:border-gray-800 rounded-md text-gray-800 dark:text-gray-200"
              >
                <option value="evening">After College (4:30 PM - 10:00 PM)</option>
                <option value="night">Late Night (8:00 PM - 12:00 AM)</option>
                <option value="morning">Early Morning (6:00 AM - 8:30 AM)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Constraints</span>
            </button>
          </div>
        </div>

        {/* Visual Appearance & Theme */}
        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181a20] shadow-2xs space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Interface Theme
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-xs text-gray-900 dark:text-white">
                Motion Visual Mode
              </div>
              <div className="text-[11px] text-gray-400">
                Switch between clean light palette and high-contrast dark theme
              </div>
            </div>

            <button
              onClick={toggleDarkMode}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Dark Theme (Active)</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-blue-600" />
                  <span>Light Theme (Active)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181a20] shadow-2xs space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Data Management & Backup
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Task Schedule JSON</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all tasks to original RSCOE Semester 1 dataset?')) {
                  resetAllData();
                }
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default Semester Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
