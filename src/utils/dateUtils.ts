export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  // We want Monday as the first day (0 = Sun -> diff = -6; 1 = Mon -> diff = 0; etc.)
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeekDays(referenceDate: Date): Date[] {
  const start = getStartOfWeek(referenceDate);
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function isToday(d: Date): boolean {
  return isSameDay(d, new Date());
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function formatDayHeader(date: Date): { dayName: string; dayNumber: number; isToday: boolean } {
  const dayName = date.toLocaleDateString([], { weekday: 'short' });
  const dayNumber = date.getDate();
  return {
    dayName,
    dayNumber,
    isToday: isToday(date),
  };
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString([], { month: 'short', year: 'numeric' });
}

export function formatFullDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTimeRange(start: Date | string, end: Date | string): string {
  return `${formatTime(start)} – ${formatTime(end)}`;
}

// Convert minutes to e.g. "1h 30m" or "45m"
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// Convert "09:30" string to minutes from start of day
export function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

// Check if a task is overdue
export function isTaskOverdue(dueDate: string, completed: boolean): boolean {
  if (completed) return false;
  return new Date(dueDate).getTime() < new Date().getTime();
}

// Calculate hours between two timestamps
export function getHoursDiff(start: Date | string, end: Date | string): number {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return Math.max(0, (e - s) / (1000 * 60 * 60));
}
