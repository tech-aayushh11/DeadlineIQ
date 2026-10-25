import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  HelpCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateTaskRisk, getRiskBadgeClasses } from '../utils/predictor';
import { formatDateShort, formatDuration } from '../utils/dateUtils';
import { Task, RiskAnalysis } from '../types/task';
import { Subject } from '../types/subject';

export const PredictorPage: React.FC = () => {
  const { tasks, subjects, openRiskModal, openTaskModal, openAutoScheduleModal } = useApp();

  const [filterLevel, setFilterLevel] = useState<string>('all');

  const subjectMap = new Map<string, Subject>(subjects.map((s) => [s.id, s]));

  // Active tasks risk evaluation
  const taskRisks: { task: Task; risk: RiskAnalysis }[] = tasks
    .filter((t: Task) => t.status !== 'completed')
    .map((task: Task) => {
      const risk = calculateTaskRisk(task, tasks);
      return { task, risk };
    })
    .sort((a, b) => b.risk.score - a.risk.score);

  const filtered = taskRisks.filter(({ risk }) => {
    if (filterLevel === 'all') return true;
    return risk.riskLevel === filterLevel;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fbfbfc] dark:bg-[#111317] overflow-y-auto select-none p-6">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        {/* Header Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Smart Deadline Risk Predictor Engine</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Deterministic academic prediction model analyzing effort, available capacity, and competing workload
            </p>
          </div>

          <button
            onClick={openAutoScheduleModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Schedule All Risks</span>
          </button>
        </div>

        {/* Mathematical Model Transparency Card */}
        <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 text-xs">
          <div className="flex items-center space-x-2 font-semibold text-purple-900 dark:text-purple-300 mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>How the Prediction Model Calculates Risk</span>
          </div>
          <p className="text-purple-800 dark:text-purple-300/80 leading-relaxed text-[11px]">
            The model computes <strong>Effective Burden = Remaining Effort (adjusted for difficulty) + 0.45 × Competing Workload</strong>. It then compares this against <strong>Available Study Hours</strong> (free hours outside RSCOE lectures before the deadline). The resulting <strong>Urgency Ratio</strong> determines the risk tier:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 font-mono text-[11px]">
            <div className="p-2 rounded bg-white dark:bg-[#13151a] border border-emerald-200 text-emerald-700 dark:text-emerald-400">
              Ratio &lt; 0.5: <strong>On Track (Low)</strong>
            </div>
            <div className="p-2 rounded bg-white dark:bg-[#13151a] border border-blue-200 text-blue-700 dark:text-blue-400">
              Ratio 0.5 - 0.85: <strong>Moderate Risk</strong>
            </div>
            <div className="p-2 rounded bg-white dark:bg-[#13151a] border border-amber-200 text-amber-700 dark:text-amber-400">
              Ratio 0.85 - 1.25: <strong>High Risk</strong>
            </div>
            <div className="p-2 rounded bg-white dark:bg-[#13151a] border border-red-200 text-red-700 dark:text-red-400">
              Ratio &gt; 1.25: <strong>Critical Risk</strong>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-gray-500 uppercase text-[10px]">Filter by Risk:</span>
          {['all', 'critical', 'high', 'moderate', 'low'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                filterLevel === lvl
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Active Task Predictions List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs">
              No tasks found matching filter "{filterLevel}".
            </div>
          ) : (
            filtered.map(({ task, risk }) => {
              const sub = subjectMap.get(task.subjectId);
              const style = getRiskBadgeClasses(risk.riskLevel);

              return (
                <div
                  key={task.id}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181a20] shadow-2xs hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <span
                          onClick={() => openTaskModal(task)}
                          className="font-bold text-sm text-gray-900 dark:text-white cursor-pointer hover:underline truncate"
                        >
                          {task.title}
                        </span>
                        {sub && (
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-medium"
                            style={{ backgroundColor: sub.badgeBg, color: sub.color }}
                          >
                            {sub.shortName}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1 font-mono">
                        <span>Due {formatDateShort(task.dueDate)}</span>
                        <span>• Est: {formatDuration(task.durationMinutes)}</span>
                        <span>• Difficulty: {task.difficulty}</span>
                        {task.hardDeadline && (
                          <span className="text-red-500 font-semibold">• Hard Cutoff</span>
                        )}
                      </div>
                    </div>

                    {/* Risk Badge & Score */}
                    <button
                      onClick={() => openRiskModal(task)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border font-bold text-xs ${style.bg} ${style.text} ${style.border}`}
                    >
                      {risk.riskLevel !== 'low' && <AlertTriangle className="w-3.5 h-3.5" />}
                      <span>{style.label} ({risk.score}%)</span>
                    </button>
                  </div>

                  {/* Diagnostic Summary & Recommendations */}
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Model Diagnosis</span>
                      <p className="text-gray-700 dark:text-gray-300 mt-0.5 text-[11px]">
                        {risk.reasons[0] || 'On schedule.'}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Recommended Action</span>
                      <p className="text-blue-600 dark:text-blue-400 mt-0.5 text-[11px] font-medium">
                        {risk.recommendations[0] || 'Continue regular study blocks.'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
