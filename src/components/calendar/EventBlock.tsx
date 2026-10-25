import React from 'react';
import { Check, Clock, AlertTriangle, MapPin } from 'lucide-react';
import { Task } from '../../types/task';
import { Subject } from '../../types/subject';
import { formatTime } from '../../utils/dateUtils';
import { calculateTaskRisk } from '../../utils/predictor';

interface EventBlockProps {
  title: string;
  start: Date;
  end: Date;
  isFixedAcademic: boolean;
  subject?: Subject;
  task?: Task;
  location?: string;
  type?: string;
  top: number;
  height: number;
  leftOffsetPercent?: number;
  widthPercent?: number;
  onClick?: () => void;
  onToggleComplete?: () => void;
  allTasks?: Task[];
}

export const EventBlock: React.FC<EventBlockProps> = ({
  title,
  start,
  end,
  isFixedAcademic,
  subject,
  task,
  location,
  top,
  height,
  leftOffsetPercent = 0,
  widthPercent = 100,
  onClick,
  onToggleComplete,
  allTasks = [],
}) => {
  const isDone = task?.status === 'completed';
  const risk = task ? calculateTaskRisk(task, allTasks) : null;

  // Visual styling depending on fixed academic class vs scheduled task
  const blockStyle = React.useMemo(() => {
    if (isFixedAcademic) {
      // Solid academic lecture / lab style
      return {
        bgLight: 'bg-blue-50/90 hover:bg-blue-100/90 border-l-4 border-blue-600 border-t border-r border-b border-blue-200 text-blue-900',
        bgDark: 'dark:bg-blue-950/60 dark:hover:bg-blue-900/60 dark:border-blue-500 dark:border-t-blue-800/40 dark:border-r-blue-800/40 dark:border-b-blue-800/40 dark:text-blue-100',
        textColor: 'text-blue-900 dark:text-blue-100',
      };
    }

    if (isDone) {
      return {
        bgLight: 'bg-gray-100/80 hover:bg-gray-200/80 border border-gray-300 text-gray-500 opacity-70',
        bgDark: 'dark:bg-gray-800/60 dark:hover:bg-gray-800 dark:border-gray-700 dark:text-gray-400 opacity-70',
        textColor: 'text-gray-500 dark:text-gray-400 line-through',
      };
    }

    // Motion-style purple or subject colored task block
    if (risk && risk.riskLevel === 'critical') {
      return {
        bgLight: 'bg-red-50 hover:bg-red-100 border-l-4 border-red-500 border-t border-r border-b border-red-200 text-red-900',
        bgDark: 'dark:bg-red-950/60 dark:hover:bg-red-900/60 dark:border-red-500 dark:border-t-red-900 dark:border-r-red-900 dark:border-b-red-900 dark:text-red-100',
        textColor: 'text-red-900 dark:text-red-100',
      };
    }

    return {
      bgLight: 'bg-purple-50 hover:bg-purple-100 border-l-4 border-purple-600 border-t border-r border-b border-purple-200 text-purple-950',
      bgDark: 'dark:bg-purple-950/60 dark:hover:bg-purple-900/60 dark:border-purple-500 dark:border-t-purple-900 dark:border-r-purple-900 dark:border-b-purple-900 dark:text-purple-100',
      textColor: 'text-purple-950 dark:text-purple-100',
    };
  }, [isFixedAcademic, isDone, risk]);

  return (
    <div
      onClick={onClick}
      style={{
        top: `${top}px`,
        height: `${Math.max(22, height)}px`,
        left: `${leftOffsetPercent}%`,
        width: `${widthPercent}%`,
      }}
      className={`absolute z-10 p-1.5 rounded text-xs select-none cursor-pointer transition-all duration-150 overflow-hidden shadow-2xs hover:shadow-sm ${blockStyle.bgLight} ${blockStyle.bgDark}`}
      title={`${title} (${formatTime(start)} - ${formatTime(end)})${location ? ` • ${location}` : ''}`}
    >
      <div className="flex items-start justify-between space-x-1 h-full">
        <div className="min-w-0 flex-1 flex flex-col justify-between h-full">
          {/* Header line: Checkbox (if task) + Title */}
          <div className="flex items-center space-x-1 leading-tight">
            {!isFixedAcademic && task && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete?.();
                }}
                className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${
                  isDone
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'border-purple-400 dark:border-purple-400 hover:border-purple-600'
                }`}
              >
                {isDone && <Check className="w-2 h-2 stroke-[3]" />}
              </button>
            )}

            <span className={`font-semibold truncate text-[11px] ${blockStyle.textColor}`}>
              {title}
            </span>
          </div>

          {/* Subtitle / Time / Location metadata (only if height allows) */}
          {height >= 36 && (
            <div className="flex items-center space-x-2 text-[10px] opacity-80 mt-0.5 truncate font-mono">
              <span className="flex items-center space-x-0.5">
                <Clock className="w-2.5 h-2.5" />
                <span>{formatTime(start)} - {formatTime(end)}</span>
              </span>
              {location && (
                <span className="flex items-center space-x-0.5 truncate hidden sm:inline-flex">
                  <MapPin className="w-2.5 h-2.5" />
                  <span>{location}</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Small Risk Warning indicator on block */}
        {risk && risk.riskLevel === 'critical' && (
          <span className="shrink-0 text-red-600 dark:text-red-400" title="Critical Deadline Risk!">
            <AlertTriangle className="w-3 h-3" />
          </span>
        )}
      </div>
    </div>
  );
};
