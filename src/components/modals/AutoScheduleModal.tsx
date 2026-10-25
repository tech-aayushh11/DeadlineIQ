import React from 'react';
import { X, Sparkles, Clock, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTimeRange, formatFullDate } from '../../utils/dateUtils';

export const AutoScheduleModal: React.FC = () => {
  const {
    isAutoScheduleModalOpen,
    closeAutoScheduleModal,
    autoScheduleProposals,
    unschedulableTasks,
    applyProposals,
    subjects,
  } = useApp();

  if (!isAutoScheduleModalOpen) return null;

  const subjectMap = new Map(subjects.map((s) => [s.id, s]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white dark:bg-[#181a20] rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col text-xs select-none">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-purple-50/50 dark:bg-purple-950/20">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-md bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Auto-Schedule Proposals
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                AI time blocking based on deadlines, priorities, and free study hours
              </p>
            </div>
          </div>
          <button
            onClick={closeAutoScheduleModal}
            className="p-1 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Proposals List */}
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {autoScheduleProposals.length === 0 && unschedulableTasks.length === 0 ? (
            <div className="py-8 text-center text-gray-400">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
              <p className="font-medium text-gray-700 dark:text-gray-300">All tasks are already optimally scheduled!</p>
              <p className="text-[11px] mt-1 text-gray-400">There are no pending or unscheduled study sessions.</p>
            </div>
          ) : (
            <>
              {autoScheduleProposals.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    <span>Proposed Time Slots ({autoScheduleProposals.length})</span>
                    <span>Risk Impact</span>
                  </div>

                  {autoScheduleProposals.map((prop, idx) => {
                    const sub = subjectMap.get(prop.subjectId);
                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-[#13151a] hover:bg-white dark:hover:bg-[#1a1d24] transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-xs text-gray-900 dark:text-white truncate">
                                {prop.title}
                              </span>
                              {sub && (
                                <span
                                  className="px-1.5 py-0.2 rounded text-[10px] font-medium"
                                  style={{ backgroundColor: sub.badgeBg, color: sub.color }}
                                >
                                  {sub.shortName}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-1.5 mt-1 text-[11px] text-gray-500 font-mono">
                              <Clock className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                              <span>{formatFullDate(prop.proposedStart)}</span>
                              <span>•</span>
                              <span>{formatTimeRange(prop.proposedStart, prop.proposedEnd)}</span>
                            </div>
                            <div className="text-[10px] text-gray-400 mt-0.5">
                              {prop.reason}
                            </div>
                          </div>

                          {/* Risk Transformation Pill */}
                          <div className="flex items-center space-x-1 text-[10px] shrink-0 font-medium">
                            <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 capitalize">
                              {prop.riskBefore}
                            </span>
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 capitalize">
                              {prop.riskAfter}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Unschedulable Tasks Warning */}
              {unschedulableTasks.length > 0 && (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 space-y-1.5">
                  <div className="flex items-center space-x-1.5 font-semibold text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>{unschedulableTasks.length} task(s) could not fit in free study windows</span>
                  </div>
                  <p className="text-[11px] opacity-90">
                    Existing classes or prior study sessions occupy available hours before these deadlines:
                  </p>
                  <ul className="list-disc list-inside text-[11px] space-y-0.5 pl-1 opacity-90">
                    {unschedulableTasks.map((t) => (
                      <li key={t.id}>
                        <span className="font-medium">{t.title}</span> (Needs {t.durationMinutes}m)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#14161b] flex items-center justify-between">
          <button
            onClick={closeAutoScheduleModal}
            className="px-3 py-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
          >
            Cancel
          </button>

          {autoScheduleProposals.length > 0 && (
            <button
              onClick={() => applyProposals(autoScheduleProposals)}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply Schedule Changes ({autoScheduleProposals.length})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
