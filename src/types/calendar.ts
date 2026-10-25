export type CalendarViewMode = 'day' | 'week' | 'month';

export interface AcademicCommitment {
  id: string;
  subjectId: string;
  title: string;
  dayOfWeek: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  startTime: string; // HH:mm format, e.g. "09:00"
  endTime: string;   // HH:mm format, e.g. "10:00"
  location: string;
  type: 'lecture' | 'lab' | 'tutorial' | 'club';
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  subjectId: string;
  isFixedAcademic: boolean;
  taskId?: string;
  completed?: boolean;
  location?: string;
  type?: string;
  color?: string;
}

export interface AutoScheduleProposal {
  taskId: string;
  title: string;
  subjectId: string;
  proposedStart: string;
  proposedEnd: string;
  durationMinutes: number;
  reason: string;
  riskBefore: string;
  riskAfter: string;
}
