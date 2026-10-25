import React from 'react';
import { X, AlertTriangle, CheckCircle, Clock, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateTaskRisk, getRiskBadgeClasses } from '../../utils/predictor';
import { formatTimeRange, formatFullDate, formatDuration } from '../../utils/dateUtils';

export const RiskExplanationModal: React.FC = () => {
  const {
    isRiskModalOpen,
    closeRiskModal,
    selectedRiskTask,
    tasks,
    subjects,
    openAutoScheduleModal,
  } = useApp();

  if (!isRiskModalOpen || !selectedRiskTask) return null;

  const risk = calculateTaskRisk(selectedRiskTask, tasks);
  const style = getRiskBadgeClasses(risk.riskLevel);
  const subject = subjects.find((s) => s.id === selectedRiskTask.subjectId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-[#181a20] rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col text-xs select-none">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#14161b]">
          <div className="flex items-center space-x-2">
            <span className={`p-1 rounded-md border ${style.bg} ${style.text} ${style.border}`}>
              <AlertTriangle className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Deadline Risk Analysis
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Deterministic mathematical workload predictor
              </p>
            </div>
          </div>
          <button
            onClick={closeRiskModal}
            className="p-1 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Task Info Pill */}
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#13151a] border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-gray-900 dark:text-white">
                {selectedRiskTask.title}
              </span>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-medium"
                style={{ backgroundColor: subject?.badgeBg, color: subject?.color }}
              >
                {subject?.shortName}
              </span>
            </div>
            <div className="mt-2 flex items-center space-x-4 text-[11px] text-gray-500 font-mono">
              <span>Due: {formatFullDate(selectedRiskTask.dueDate)}</span>
              <span>• Est: {formatDuration(selectedRiskTask.durationMinutes)}</span>
              <span>• Diff: {selectedRiskTask.difficulty}</span>
            </div>
          </div>

          {/* Risk Metric Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#15171d] text-center">
              <div className="text-[10px] uppercase font-bold text-gray-400">Risk Score</div>
              <div className="text-lg font-bold mt-0.5 text-gray-900 dark:text-white font-mono">
                {risk.score}<span className="text-xs font-normal text-gray-400">/100</span>
              </div>
              <div className={`mt-0.5 text-[10px] font-semibold ${style.text}`}>
                {style.label}
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#15171d] text-center">
              <div className="text-[10px] uppercase font-bold text-gray-400">Remaining Effort</div>
              <div className="text-lg font-bold mt-0.5 text-gray-900 dark:text-white font-mono">
                {risk.remainingEffortHours}h
              </div>
              <div className="mt-0.5 text-[10px] text-gray-400">
                Progress: {selectedRiskTask.progress}%
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#15171d] text-center">
              <div className="text-[10px] uppercase font-bold text-gray-400">Available Study</div>
              <div className="text-lg font-bold mt-0.5 text-gray-900 dark:text-white font-mono">
                {risk.availableStudyHours}h
              </div>
              <div className="mt-0.5 text-[10px] text-gray-400">
                Excl. lectures
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#15171d] text-center">
              <div className="text-[10px] uppercase font-bold text-gray-400">Competing Load</div>
              <div className="text-lg font-bold mt-0.5 text-gray-900 dark:text-white font-mono">
                {risk.competingWorkloadHours}h
              </div>
              <div className="mt-0.5 text-[10px] text-gray-400">
                Concurrent tasks
              </div>
            </div>
          </div>

          {/* Diagnosis & Reasons */}
          <div className="space-y-1.5">
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span>Diagnostic Reasons</span>
            </h4>
            <div className="space-y-1">
              {risk.reasons.map((r, i) => (
                <div
                  key={i}
                  className="p-2 rounded bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-gray-700 dark:text-gray-300 flex items-start space-x-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="space-y-1.5">
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center space-x-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Feasibility Recommendations</span>
            </h4>
            <div className="space-y-1">
              {risk.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="p-2 rounded bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-gray-700 dark:text-gray-300 flex items-start space-x-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#14161b] flex items-center justify-between">
          <button
            onClick={closeRiskModal}
            className="px-3 py-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
          >
            Dismiss
          </button>

          <button
            onClick={() => {
              closeRiskModal();
              openAutoScheduleModal();
            }}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Auto-Scheduler</span>
          </button>
        </div>
      </div>
    </div>
  );
};
