import { Task } from '../types/task';
import { getStartOfWeek } from '../utils/dateUtils';

// Helper to create dates relative to the current week's Monday
export function createSampleTasks(): Task[] {
  const today = new Date();
  const startOfWeek = getStartOfWeek(today);

  // Helper to format date offset
  const getDateAt = (dayOffset: number, hours: number, minutes: number = 0): string => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + dayOffset);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
  };

  // 1 day before today (for overdue demo)
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  yesterday.setHours(18, 0, 0, 0);

  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);
  twoDaysAgo.setHours(20, 0, 0, 0);

  return [
    // Overdue tasks (Matches Motion's "2 tasks past due" warning banner!)
    {
      id: 'task-overdue-1',
      title: 'Submit Exp. 2: Python Functions & Recursion Logbook',
      description: 'Upload signed lab logbook PDF and GitHub repo link to RSCOE Moodle portal.',
      subjectId: 'sub-py',
      type: 'lab_submission',
      durationMinutes: 45,
      dueDate: yesterday.toISOString(),
      priority: 'urgent',
      status: 'todo',
      difficulty: 'moderate',
      importance: 5,
      progress: 30,
      hardDeadline: true,
      autoScheduled: false,
      schedulePreference: 'evening_study',
      subtasks: [
        { id: 'st-1', title: 'Format code according to PEP8', completed: true },
        { id: 'st-2', title: 'Generate PDF output report', completed: false },
        { id: 'st-3', title: 'Submit on college portal', completed: false }
      ],
      createdAt: twoDaysAgo.toISOString()
    },
    {
      id: 'task-overdue-2',
      title: 'Prob & Stats Tutorial 1: Conditional Distributions',
      description: 'Solve questions 4 through 12 from Unit 1 tutorial handout.',
      subjectId: 'sub-ps',
      type: 'assignment',
      durationMinutes: 60,
      dueDate: yesterday.toISOString(),
      priority: 'high',
      status: 'todo',
      difficulty: 'hard',
      importance: 4,
      progress: 15,
      hardDeadline: false,
      autoScheduled: false,
      schedulePreference: 'anytime',
      subtasks: [
        { id: 'st-4', title: 'Solve Bayes Theorem proof', completed: true },
        { id: 'st-5', title: 'Graph distribution density in notes', completed: false }
      ],
      createdAt: twoDaysAgo.toISOString()
    },

    // Monday Tasks (Scheduled in calendar, matching Motion screenshots)
    {
      id: 'task-mon-1',
      title: 'Write Medium Review & Tech Article',
      description: 'Review modern scheduling algorithms and write notes for seminar presentation.',
      subjectId: 'sub-sed',
      type: 'study_session',
      durationMinutes: 45,
      dueDate: getDateAt(0, 18, 0),
      priority: 'medium',
      status: 'completed',
      difficulty: 'moderate',
      importance: 3,
      progress: 100,
      hardDeadline: false,
      autoScheduled: true,
      scheduledStart: getDateAt(0, 9, 50),
      scheduledEnd: getDateAt(0, 10, 35),
      schedulePreference: 'work_hours',
      subtasks: [],
      createdAt: getDateAt(-3, 10, 0),
      completedAt: getDateAt(0, 10, 35)
    },
    {
      id: 'task-mon-2',
      title: 'FDS Binary Search Tree Implementation',
      description: 'Complete insert, search, and inorder traversal in C++ for lab verification.',
      subjectId: 'sub-fds',
      type: 'lab_submission',
      durationMinutes: 90,
      dueDate: getDateAt(1, 14, 0),
      priority: 'high',
      status: 'todo',
      difficulty: 'hard',
      importance: 5,
      progress: 40,
      hardDeadline: true,
      autoScheduled: true,
      scheduledStart: getDateAt(0, 15, 30),
      scheduledEnd: getDateAt(0, 17, 0),
      schedulePreference: 'evening_study',
      subtasks: [
        { id: 'st-6', title: 'Define node structure and recursive insert', completed: true },
        { id: 'st-7', title: 'Implement iterative search function', completed: true },
        { id: 'st-8', title: 'Handle deletion with two children', completed: false }
      ],
      createdAt: getDateAt(-2, 11, 0)
    },
    {
      id: 'task-mon-3',
      title: 'Check emails & department notices',
      description: 'Review updates from HOD regarding upcoming mid-sem unit test schedule.',
      subjectId: 'sub-ec',
      type: 'personal',
      durationMinutes: 20,
      dueDate: getDateAt(0, 18, 30),
      priority: 'low',
      status: 'completed',
      difficulty: 'easy',
      importance: 2,
      progress: 100,
      hardDeadline: false,
      autoScheduled: true,
      scheduledStart: getDateAt(0, 17, 15),
      scheduledEnd: getDateAt(0, 17, 35),
      schedulePreference: 'anytime',
      subtasks: [],
      createdAt: getDateAt(0, 8, 0),
      completedAt: getDateAt(0, 17, 35)
    },

    // Tuesday Tasks
    {
      id: 'task-tue-1',
      title: 'COA Cache Mapping Simulator Lab',
      description: 'Implement direct mapping and 2-way set associative cache simulator in Python.',
      subjectId: 'sub-coa',
      type: 'assignment',
      durationMinutes: 75,
      dueDate: getDateAt(2, 18, 0),
      priority: 'urgent',
      status: 'in_progress',
      difficulty: 'very_hard',
      importance: 5,
      progress: 50,
      hardDeadline: true,
      autoScheduled: true,
      scheduledStart: getDateAt(1, 15, 30),
      scheduledEnd: getDateAt(1, 16, 45),
      schedulePreference: 'evening_study',
      subtasks: [
        { id: 'st-9', title: 'Parse memory address into tag, index, offset', completed: true },
        { id: 'st-10', title: 'Implement LRU eviction policy', completed: false }
      ],
      createdAt: getDateAt(-1, 9, 0)
    },
    {
      id: 'task-tue-2',
      title: 'Exp. 4: Python String Manipulation & RegEx',
      description: 'Implement expression matching and document analysis functions using re module.',
      subjectId: 'sub-py',
      type: 'lab_submission',
      durationMinutes: 60,
      dueDate: getDateAt(2, 23, 59),
      priority: 'high',
      status: 'todo',
      difficulty: 'moderate',
      importance: 4,
      progress: 20,
      hardDeadline: true,
      autoScheduled: true,
      scheduledStart: getDateAt(1, 17, 0),
      scheduledEnd: getDateAt(1, 18, 0),
      schedulePreference: 'evening_study',
      subtasks: [],
      createdAt: getDateAt(0, 10, 0)
    },

    // Wednesday Tasks
    {
      id: 'task-wed-1',
      title: 'Design Thinking Persona & Journey Map',
      description: 'Synthesize student interview findings for campus smart mobility innovation challenge.',
      subjectId: 'sub-dti',
      type: 'project',
      durationMinutes: 90,
      dueDate: getDateAt(3, 17, 0),
      priority: 'medium',
      status: 'todo',
      difficulty: 'moderate',
      importance: 3,
      progress: 35,
      hardDeadline: false,
      autoScheduled: true,
      scheduledStart: getDateAt(2, 16, 0),
      scheduledEnd: getDateAt(2, 17, 30),
      schedulePreference: 'work_hours',
      subtasks: [
        { id: 'st-11', title: 'Draft empathy map quadrants', completed: true },
        { id: 'st-12', title: 'Identify primary pain points & opportunities', completed: false }
      ],
      createdAt: getDateAt(-1, 12, 0)
    },
    {
      id: 'task-wed-2',
      title: 'OS Process Synchronization & Semaphore Quiz Prep',
      description: 'Review dining philosophers and producer-consumer problems.',
      subjectId: 'sub-os',
      type: 'exam_prep',
      durationMinutes: 60,
      dueDate: getDateAt(4, 9, 0),
      priority: 'high',
      status: 'todo',
      difficulty: 'hard',
      importance: 4,
      progress: 10,
      hardDeadline: true,
      autoScheduled: true,
      scheduledStart: getDateAt(2, 18, 0),
      scheduledEnd: getDateAt(2, 19, 0),
      schedulePreference: 'evening_study',
      subtasks: [],
      createdAt: getDateAt(0, 14, 0)
    },

    // Thursday Tasks
    {
      id: 'task-thu-1',
      title: 'Software Engineering SRS Section 3 Draft',
      description: 'Document functional requirements and use case specifications for mini-project.',
      subjectId: 'sub-sed',
      type: 'project',
      durationMinutes: 75,
      dueDate: getDateAt(4, 18, 0),
      priority: 'medium',
      status: 'todo',
      difficulty: 'moderate',
      importance: 3,
      progress: 25,
      hardDeadline: false,
      autoScheduled: true,
      scheduledStart: getDateAt(3, 16, 30),
      scheduledEnd: getDateAt(3, 17, 45),
      schedulePreference: 'evening_study',
      subtasks: [],
      createdAt: getDateAt(1, 11, 0)
    },

    // Friday Tasks
    {
      id: 'task-fri-1',
      title: 'Smart India Hackathon Problem Statement Ideation',
      description: 'Brainstorm architectural diagram and draft 3-page proposal for AI category.',
      subjectId: 'sub-ec',
      type: 'project',
      durationMinutes: 90,
      dueDate: getDateAt(5, 20, 0),
      priority: 'high',
      status: 'todo',
      difficulty: 'hard',
      importance: 4,
      progress: 15,
      hardDeadline: false,
      autoScheduled: true,
      scheduledStart: getDateAt(4, 16, 30),
      scheduledEnd: getDateAt(4, 18, 0),
      schedulePreference: 'evening_study',
      subtasks: [],
      createdAt: getDateAt(2, 16, 0)
    },

    // Unscheduled Tasks (Ready for user to trigger Auto-Schedule!)
    {
      id: 'task-unscheduled-1',
      title: 'NPTEL Python Iterators & Generators Lecture Watch',
      description: 'Watch video module 4 and solve assignment questions on iterators.',
      subjectId: 'sub-py',
      type: 'study_session',
      durationMinutes: 45,
      dueDate: getDateAt(5, 23, 59),
      priority: 'medium',
      status: 'todo',
      difficulty: 'easy',
      importance: 3,
      progress: 0,
      hardDeadline: false,
      autoScheduled: false,
      schedulePreference: 'anytime',
      subtasks: [],
      createdAt: getDateAt(0, 9, 0)
    },
    {
      id: 'task-unscheduled-2',
      title: 'Probability Unit 2 Practice: Continuous Random Variables',
      description: 'Practice normal and exponential distribution word problems.',
      subjectId: 'sub-ps',
      type: 'assignment',
      durationMinutes: 60,
      dueDate: getDateAt(6, 18, 0),
      priority: 'high',
      status: 'todo',
      difficulty: 'hard',
      importance: 4,
      progress: 0,
      hardDeadline: false,
      autoScheduled: false,
      schedulePreference: 'evening_study',
      subtasks: [],
      createdAt: getDateAt(1, 10, 0)
    }
  ];
}
