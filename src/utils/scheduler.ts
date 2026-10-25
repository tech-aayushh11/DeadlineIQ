import { Task } from '../types/task';
import { AcademicCommitment, AutoScheduleProposal } from '../types/calendar';
import { calculateTaskRisk } from './predictor';

interface TimeInterval {
  start: Date;
  end: Date;
}

// College study hours windows:
// Weekdays (Mon-Fri): 16:30 to 22:00 (after college)
// Weekends (Sat-Sun): 09:30 to 13:00, and 15:00 to 21:00
export function findAvailableSlots(
  daysToCheck: Date[],
  existingTasks: Task[],
  fixedSchedule: AcademicCommitment[]
): TimeInterval[] {
  const occupiedIntervals: TimeInterval[] = [];

  // Add all scheduled tasks
  existingTasks.forEach((t) => {
    if (t.scheduledStart && t.scheduledEnd && t.status !== 'completed') {
      occupiedIntervals.push({
        start: new Date(t.scheduledStart),
        end: new Date(t.scheduledEnd),
      });
    }
  });

  // Add fixed college commitments mapped to each day in daysToCheck
  daysToCheck.forEach((day) => {
    const dayOfWeek = day.getDay();
    const commitments = fixedSchedule.filter((c) => c.dayOfWeek === dayOfWeek);
    commitments.forEach((c) => {
      const [sh, sm] = c.startTime.split(':').map(Number);
      const [eh, em] = c.endTime.split(':').map(Number);
      const start = new Date(day);
      start.setHours(sh, sm, 0, 0);
      const end = new Date(day);
      end.setHours(eh, em, 0, 0);
      occupiedIntervals.push({ start, end });
    });
  });

  // Sort occupied intervals
  occupiedIntervals.sort((a, b) => a.start.getTime() - b.start.getTime());

  // Generate candidate study windows for each day
  const freeSlots: TimeInterval[] = [];

  daysToCheck.forEach((day) => {
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
    const windows: { startH: number; startM: number; endH: number; endM: number }[] = [];

    if (isWeekend) {
      windows.push({ startH: 9, startM: 30, endH: 13, endM: 0 });
      windows.push({ startH: 14, startM: 30, endH: 21, endM: 0 });
    } else {
      windows.push({ startH: 16, startM: 30, endH: 22, endM: 0 });
    }

    windows.forEach((win) => {
      const winStart = new Date(day);
      winStart.setHours(win.startH, win.startM, 0, 0);
      const winEnd = new Date(day);
      winEnd.setHours(win.endH, win.endM, 0, 0);

      // Carve out occupied blocks from this window
      let currentPointer = winStart;

      const dayConflicts = occupiedIntervals.filter(
        (occ) => occ.end > winStart && occ.start < winEnd
      );

      for (const conflict of dayConflicts) {
        if (conflict.start > currentPointer) {
          const durationMins = (conflict.start.getTime() - currentPointer.getTime()) / (1000 * 60);
          if (durationMins >= 30) {
            freeSlots.push({ start: new Date(currentPointer), end: new Date(conflict.start) });
          }
        }
        if (conflict.end > currentPointer) {
          currentPointer = new Date(conflict.end);
        }
      }

      if (currentPointer < winEnd) {
        const durationMins = (winEnd.getTime() - currentPointer.getTime()) / (1000 * 60);
        if (durationMins >= 30) {
          freeSlots.push({ start: new Date(currentPointer), end: new Date(winEnd) });
        }
      }
    });
  });

  return freeSlots;
}

export function generateAutoScheduleProposals(
  tasks: Task[],
  fixedSchedule: AcademicCommitment[],
  referenceDate: Date = new Date()
): { proposals: AutoScheduleProposal[]; unschedulableTasks: Task[] } {
  // Filter unscheduled or autoScheduled tasks that are not completed
  const candidateTasks = tasks
    .filter((t) => t.status !== 'completed' && (!t.scheduledStart || t.autoScheduled))
    .map((t) => {
      const risk = calculateTaskRisk(t, tasks);
      return { task: t, risk };
    });

  // Sort by priority and deadline
  candidateTasks.sort((a, b) => {
    // Overdue first
    const aDue = new Date(a.task.dueDate).getTime();
    const bDue = new Date(b.task.dueDate).getTime();
    if (a.risk.riskLevel === 'critical' && b.risk.riskLevel !== 'critical') return -1;
    if (b.risk.riskLevel === 'critical' && a.risk.riskLevel !== 'critical') return 1;

    // Hard deadlines first
    if (a.task.hardDeadline && !b.task.hardDeadline) return -1;
    if (!a.task.hardDeadline && b.task.hardDeadline) return 1;

    return aDue - bDue;
  });

  // Look ahead 14 days
  const daysToCheck: Date[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(referenceDate);
    d.setDate(d.getDate() + i);
    daysToCheck.push(d);
  }

  // Already fixed tasks (scheduled manually by user)
  const lockedTasks = tasks.filter((t) => t.status !== 'completed' && t.scheduledStart && !t.autoScheduled);
  let availableSlots = findAvailableSlots(daysToCheck, lockedTasks, fixedSchedule);

  const proposals: AutoScheduleProposal[] = [];
  const unschedulableTasks: Task[] = [];

  for (const { task, risk } of candidateTasks) {
    const taskDue = new Date(task.dueDate);
    const duration = task.durationMinutes;

    // Find slot before taskDue that fits duration
    let assigned = false;

    for (let i = 0; i < availableSlots.length; i++) {
      const slot = availableSlots[i];
      const slotDuration = (slot.end.getTime() - slot.start.getTime()) / (1000 * 60);

      // Slot must start after now and before deadline
      if (slot.start.getTime() >= new Date().getTime() && slot.start.getTime() < taskDue.getTime()) {
        if (slotDuration >= duration) {
          const proposedStart = new Date(slot.start);
          const proposedEnd = new Date(slot.start.getTime() + duration * 60 * 1000);

          proposals.push({
            taskId: task.id,
            title: task.title,
            subjectId: task.subjectId,
            proposedStart: proposedStart.toISOString(),
            proposedEnd: proposedEnd.toISOString(),
            durationMinutes: duration,
            reason: `Optimally placed before deadline (${new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}) with 0 conflict.`,
            riskBefore: risk.riskLevel,
            riskAfter: 'low',
          });

          // Update available slot
          if (slotDuration - duration >= 30) {
            availableSlots[i] = {
              start: proposedEnd,
              end: slot.end,
            };
          } else {
            availableSlots.splice(i, 1);
          }

          assigned = true;
          break;
        }
      }
    }

    if (!assigned) {
      unschedulableTasks.push(task);
    }
  }

  return { proposals, unschedulableTasks };
}
