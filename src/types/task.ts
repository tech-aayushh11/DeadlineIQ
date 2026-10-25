export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export type TaskType = 'assignment' | 'lab_submission' | 'study_session' | 'project' | 'exam_prep' | 'personal';

export type SchedulePreference = 'work_hours' | 'evening_study' | 'anytime' | 'weekend';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  subjectId: string;
  type: TaskType;
  durationMinutes: number; // estimated duration in minutes
  dueDate: string; // ISO string or YYYY-MM-DDTHH:mm
  startDate?: string;
  priority: Priority;
  status: TaskStatus;
  difficulty: 'easy' | 'moderate' | 'hard' | 'very_hard';
  importance: number; // 1 to 5
  progress: number; // 0 to 100
  hardDeadline: boolean; // if true, strictly fixed academic cutoff
  autoScheduled: boolean; // if true, automatically slotted into calendar
  scheduledStart?: string; // YYYY-MM-DDTHH:mm:ss
  scheduledEnd?: string; // YYYY-MM-DDTHH:mm:ss
  schedulePreference: SchedulePreference;
  subtasks: Subtask[];
  createdAt: string;
  completedAt?: string;
}

export interface RiskAnalysis {
  riskLevel: RiskLevel;
  score: number; // 0 - 100
  remainingEffortHours: number;
  availableStudyHours: number;
  competingWorkloadHours: number;
  urgencyRatio: number;
  reasons: string[];
  recommendations: string[];
}
