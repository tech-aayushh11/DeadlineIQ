import { Task, RiskAnalysis, RiskLevel } from '../types/task';
import { AcademicCommitment } from '../types/calendar';

const DIFFICULTY_MULTIPLIERS = {
  easy: 0.9,
  moderate: 1.0,
  hard: 1.25,
  very_hard: 1.5,
};

// Daily max available study hours outside college hours (default 5.5 hours/day)
const DAILY_AVAILABLE_STUDY_HOURS = 5.0;

export function calculateTaskRisk(
  task: Task,
  allTasks: Task[],
  _commitments?: AcademicCommitment[]
): RiskAnalysis {
  if (task.status === 'completed') {
    return {
      riskLevel: 'low',
      score: 5,
      remainingEffortHours: 0,
      availableStudyHours: 0,
      competingWorkloadHours: 0,
      urgencyRatio: 0,
      reasons: ['Task is completed.'],
      recommendations: ['Great job! Completed on schedule.'],
    };
  }

  const now = new Date();
  const due = new Date(task.dueDate);
  const msUntilDue = due.getTime() - now.getTime();
  const hoursUntilDue = msUntilDue / (1000 * 60 * 60);

  // Remaining effort in hours factoring in progress & difficulty
  const baseHours = task.durationMinutes / 60;
  const progressRatio = Math.min(100, Math.max(0, task.progress)) / 100;
  const diffMultiplier = DIFFICULTY_MULTIPLIERS[task.difficulty] || 1.0;
  const remainingEffortHours = Math.max(0.1, Number(((baseHours * (1 - progressRatio)) * diffMultiplier).toFixed(2)));

  // If already overdue
  if (hoursUntilDue <= 0) {
    return {
      riskLevel: 'critical',
      score: 98,
      remainingEffortHours,
      availableStudyHours: 0,
      competingWorkloadHours: 0,
      urgencyRatio: 9.9,
      reasons: [
        'Deadline has passed and task is incomplete.',
        `Missed deadline by ${Math.abs(Math.round(hoursUntilDue))} hours.`,
      ],
      recommendations: [
        'Immediate action required: Complete the remaining work or submit an extension request.',
        'Reschedule to the next earliest open calendar block.',
      ],
    };
  }

  // Calculate available study hours (days remaining * study hours/day)
  const daysUntilDue = Math.max(0.2, hoursUntilDue / 24);
  const availableStudyHours = Number((Math.min(hoursUntilDue, daysUntilDue * DAILY_AVAILABLE_STUDY_HOURS)).toFixed(1));

  // Competing workload: active tasks due before or around this task's deadline
  const competingTasks = allTasks.filter(
    (t) =>
      t.id !== task.id &&
      t.status !== 'completed' &&
      new Date(t.dueDate).getTime() <= due.getTime() + 24 * 60 * 60 * 1000 &&
      new Date(t.dueDate).getTime() >= now.getTime()
  );

  const competingWorkloadHours = Number(
    competingTasks
      .reduce((sum, t) => {
        const tBase = t.durationMinutes / 60;
        const tProg = (t.progress || 0) / 100;
        const tDiff = DIFFICULTY_MULTIPLIERS[t.difficulty] || 1.0;
        return sum + tBase * (1 - tProg) * tDiff;
      }, 0)
      .toFixed(2)
  );

  // Total burden ratio = (remainingEffort + 0.45 * competingWorkload) / availableStudyHours
  const effectiveBurden = remainingEffortHours + 0.45 * competingWorkloadHours;
  const urgencyRatio = Number((effectiveBurden / Math.max(availableStudyHours, 0.5)).toFixed(2));

  let riskLevel: RiskLevel = 'low';
  let score = Math.min(100, Math.round(urgencyRatio * 50));
  const reasons: string[] = [];
  const recommendations: string[] = [];

  if (urgencyRatio >= 1.25 || (hoursUntilDue < 12 && remainingEffortHours > 2)) {
    riskLevel = 'critical';
    score = Math.max(85, Math.min(99, Math.round(urgencyRatio * 60)));
    reasons.push(`Total workload demand (${effectiveBurden.toFixed(1)}h) exceeds available capacity (${availableStudyHours}h).`);
    if (competingTasks.length > 0) {
      reasons.push(`${competingTasks.length} other urgent tasks compete for the same study window.`);
    }
    recommendations.push('Immediate intervention: Use Auto-Schedule to allocate dedicated time blocks right now.');
    recommendations.push('Consider offloading flexible non-hard deadline tasks to next weekend.');
  } else if (urgencyRatio >= 0.85 || (hoursUntilDue < 24 && remainingEffortHours > availableStudyHours * 0.7)) {
    riskLevel = 'high';
    score = Math.max(65, Math.min(84, Math.round(urgencyRatio * 55)));
    reasons.push(`Remaining effort (${remainingEffortHours}h) uses over 85% of realistic study time before deadline.`);
    if (competingTasks.length > 0) {
      reasons.push(`Competing tasks add ${competingWorkloadHours}h pressure to your schedule.`);
    }
    recommendations.push('Book a study session in your calendar within the next 24 hours.');
    recommendations.push('Break task into 45-minute sprint blocks to maintain steady progress.');
  } else if (urgencyRatio >= 0.5 || remainingEffortHours > availableStudyHours * 0.45) {
    riskLevel = 'moderate';
    score = Math.max(35, Math.min(64, Math.round(urgencyRatio * 50)));
    reasons.push('Schedule is manageable but requires consistent allocation.');
    recommendations.push('Keep to the planned study blocks. Ensure prep begins 2 days ahead.');
  } else {
    riskLevel = 'low';
    score = Math.max(10, Math.min(34, Math.round(urgencyRatio * 35)));
    reasons.push('Ample study time available before deadline.');
    recommendations.push('On track. Scheduled sessions fit comfortably within college schedule.');
  }

  return {
    riskLevel,
    score,
    remainingEffortHours,
    availableStudyHours,
    competingWorkloadHours,
    urgencyRatio,
    reasons,
    recommendations,
  };
}

export function getRiskBadgeClasses(level: RiskLevel): { bg: string; text: string; border: string; label: string } {
  switch (level) {
    case 'critical':
      return { bg: 'bg-red-50 dark:bg-red-950/40', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800', label: 'Critical' };
    case 'high':
      return { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', label: 'High Risk' };
    case 'moderate':
      return { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', label: 'Moderate' };
    case 'low':
    default:
      return { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', label: 'On Track' };
  }
}
