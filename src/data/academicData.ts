import { Subject, StudentProfile } from '../types/subject';
import { AcademicCommitment } from '../types/calendar';

export const CURRENT_STUDENT: StudentProfile = {
  name: 'Devashish Patki',
  prn: '72225890C',
  institution: 'Rajarshi Shahu College of Engineering, Tathawade, Pune',
  program: 'Bachelor of Technology — Information Technology Engineering',
  academicYear: '2026–27',
  semester: 1,
  division: 'IT-A',
  rollNo: 'ITA-42',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
};

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-ps',
    code: 'BAS-101',
    name: 'Probability and Statistics',
    shortName: 'Prob & Stats',
    component: 'Theory',
    credits: 4,
    color: '#3b82f6', // restrained blue
    textColor: '#ffffff',
    badgeBg: '#eff6ff',
    facultyName: 'Dr. S. K. Kulkarni',
    classroom: 'Room 304, Academic Block A',
    resources: [
      { id: 'res-ps-1', name: 'Course Syllabus & Marking Scheme', type: 'pdf', fileSize: '1.2 MB', category: 'syllabus' },
      { id: 'res-ps-2', name: 'Unit 1: Probability Distribution Lecture Notes', type: 'notes', fileSize: '3.4 MB', category: 'notes' },
      { id: 'res-ps-3', name: 'NPTEL Probability & Random Variables Playlist', type: 'video', category: 'video' }
    ]
  },
  {
    id: 'sub-coa',
    code: 'PCC-IT101',
    name: 'Computer Organization and Architecture',
    shortName: 'COA',
    component: 'Theory',
    credits: 3,
    color: '#0284c7', // sky blue
    textColor: '#ffffff',
    badgeBg: '#f0f9ff',
    facultyName: 'Prof. M. R. Deshpande',
    classroom: 'Room 305, Academic Block A',
    resources: [
      { id: 'res-coa-1', name: 'COA Complete Syllabus', type: 'pdf', fileSize: '850 KB', category: 'syllabus' },
      { id: 'res-coa-2', name: 'MIPS Instruction Set Architecture Cheatsheet', type: 'pdf', fileSize: '420 KB', category: 'cheatsheet' },
      { id: 'res-coa-3', name: 'Memory Hierarchy & Cache Mapping Slides', type: 'doc', fileSize: '2.8 MB', category: 'notes' }
    ]
  },
  {
    id: 'sub-sed',
    code: 'PCC-IT102',
    name: 'Software Engineering and Design',
    shortName: 'SE&D',
    component: 'Theory',
    credits: 3,
    color: '#0d9488', // teal
    textColor: '#ffffff',
    badgeBg: '#f0fdfa',
    facultyName: 'Dr. V. N. Patil',
    classroom: 'Seminar Hall B',
    resources: [
      { id: 'res-sed-1', name: 'Agile & Scrum Methodology Guide', type: 'pdf', fileSize: '1.9 MB', category: 'notes' },
      { id: 'res-sed-2', name: 'SRS Specification Template IEEE 830', type: 'doc', fileSize: '310 KB', category: 'notes' },
      { id: 'res-sed-3', name: 'UML Class and Sequence Diagrams Walkthrough', type: 'video', category: 'video' }
    ]
  },
  {
    id: 'sub-fds',
    code: 'PCC-IT103',
    name: 'Fundamentals of Data Structure',
    shortName: 'FDS',
    component: 'Theory',
    credits: 4,
    color: '#6366f1', // indigo
    textColor: '#ffffff',
    badgeBg: '#eef2ff',
    facultyName: 'Prof. P. B. Shinde',
    classroom: 'Room 201, IT Wing',
    resources: [
      { id: 'res-fds-1', name: 'FDS Syllabus & Lab Objectives', type: 'pdf', fileSize: '1.1 MB', category: 'syllabus' },
      { id: 'res-fds-2', name: 'Stack, Queue, and Linked List Implementations', type: 'code', fileSize: '140 KB', category: 'experiment' },
      { id: 'res-fds-3', name: 'Trees & BST Traversal Video Lectures', type: 'video', category: 'video' }
    ]
  },
  {
    id: 'sub-os',
    code: 'PCC-IT104',
    name: 'Operating Systems',
    shortName: 'OS',
    component: 'Theory',
    credits: 3,
    color: '#8b5cf6', // purple
    textColor: '#ffffff',
    badgeBg: '#f5f3ff',
    facultyName: 'Dr. A. A. Joshi',
    classroom: 'Room 302, Academic Block A',
    resources: [
      { id: 'res-os-1', name: 'Operating Systems Course Structure', type: 'pdf', fileSize: '790 KB', category: 'syllabus' },
      { id: 'res-os-2', name: 'CPU Scheduling Algorithms Simulation Guide', type: 'notes', fileSize: '2.1 MB', category: 'notes' },
      { id: 'res-os-3', name: 'Deadlock Detection & Banker Algorithm PDF', type: 'pdf', fileSize: '1.5 MB', category: 'notes' }
    ]
  },
  {
    id: 'sub-dti',
    code: 'MC-101',
    name: 'Design Thinking and Innovation',
    shortName: 'DTI',
    component: 'Practical',
    credits: 2,
    color: '#d97706', // amber
    textColor: '#ffffff',
    badgeBg: '#fffbeb',
    facultyName: 'Prof. R. T. Gaikwad',
    classroom: 'Innovation & Incubation Hub, 4th Floor',
    resources: [
      { id: 'res-dti-1', name: 'Design Thinking 5-Stage Framework Manual', type: 'pdf', fileSize: '3.6 MB', category: 'manual' },
      { id: 'res-dti-2', name: 'Empathy Map & Persona Canvas Templates', type: 'doc', fileSize: '980 KB', category: 'notes' }
    ]
  },
  {
    id: 'sub-py',
    code: 'LC-IT101',
    name: 'Programming Lab-I: Python',
    shortName: 'Python Lab',
    component: 'Lab',
    credits: 2,
    color: '#10b981', // emerald
    textColor: '#ffffff',
    badgeBg: '#ecfdf5',
    facultyName: 'Prof. C. S. Jadhav',
    classroom: 'IT Lab 3 (Systems & AI Lab)',
    resources: [
      { id: 'res-py-1', name: 'PL 1 lab manual', type: 'pdf', fileSize: '4.8 MB', category: 'manual' },
      { id: 'res-py-2', name: 'Lab manual', type: 'pdf', fileSize: '5.2 MB', category: 'manual' },
      { id: 'res-py-3', name: 'Syllabus', type: 'pdf', fileSize: '940 KB', category: 'syllabus' },
      { id: 'res-py-4', name: 'NPTEL video', type: 'video', category: 'video' },
      { id: 'res-py-5', name: 'NPTEL Videos', type: 'video', category: 'video' },
      { id: 'res-py-6', name: 'EXP. 1: Basic Python Syntax & Control Flow', type: 'code', fileSize: '45 KB', category: 'experiment' },
      { id: 'res-py-7', name: 'Exp. 2: Functions, Recursion & Scope', type: 'code', fileSize: '52 KB', category: 'experiment' },
      { id: 'res-py-8', name: 'Python Operators', type: 'notes', fileSize: '320 KB', category: 'cheatsheet' },
      { id: 'res-py-9', name: 'Exp.4: String Manipulation and RegEx', type: 'code', fileSize: '68 KB', category: 'experiment' },
      { id: 'res-py-10', name: 'tuple: Immutable Sequences Deep Dive', type: 'notes', fileSize: '210 KB', category: 'notes' },
      { id: 'res-py-11', name: 'list: Dynamic Array Operations & Methods', type: 'notes', fileSize: '290 KB', category: 'notes' }
    ]
  },
  {
    id: 'sub-ec',
    code: 'AC-101',
    name: 'Extra-Curricular (Hackathon/NSS/Sports/Club Activity)',
    shortName: 'Extra-Curricular',
    component: 'Activity',
    credits: 1,
    color: '#64748b', // slate
    textColor: '#ffffff',
    badgeBg: '#f8fafc',
    facultyName: 'Student Activity Council & Faculty Coordinators',
    classroom: 'College Auditorium / Sports Complex',
    resources: [
      { id: 'res-ec-1', name: 'Smart India Hackathon 2026 Internal Selection Guidelines', type: 'pdf', fileSize: '1.4 MB', category: 'notes' },
      { id: 'res-ec-2', name: 'NSS Social Outreach Activity Logbook', type: 'doc', fileSize: '650 KB', category: 'manual' }
    ]
  }
];

// Fixed Weekly College Schedule (Mon - Fri) at RSCOE
export const FIXED_COLLEGE_SCHEDULE: AcademicCommitment[] = [
  // Monday
  { id: 'fix-m1', subjectId: 'sub-ps', title: 'Probability & Statistics Lecture', dayOfWeek: 1, startTime: '09:00', endTime: '10:00', location: 'Room 304', type: 'lecture' },
  { id: 'fix-m2', subjectId: 'sub-coa', title: 'COA Lecture', dayOfWeek: 1, startTime: '10:00', endTime: '11:00', location: 'Room 305', type: 'lecture' },
  { id: 'fix-m3', subjectId: 'sub-py', title: 'Python Programming Lab (Batch A1)', dayOfWeek: 1, startTime: '11:15', endTime: '13:15', location: 'IT Lab 3', type: 'lab' },
  { id: 'fix-m4', subjectId: 'sub-fds', title: 'Data Structures Lecture', dayOfWeek: 1, startTime: '14:00', endTime: '15:00', location: 'Room 201', type: 'lecture' },

  // Tuesday
  { id: 'fix-t1', subjectId: 'sub-sed', title: 'Software Engineering Lecture', dayOfWeek: 2, startTime: '09:00', endTime: '10:00', location: 'Seminar Hall B', type: 'lecture' },
  { id: 'fix-t2', subjectId: 'sub-os', title: 'Operating Systems Lecture', dayOfWeek: 2, startTime: '10:00', endTime: '11:00', location: 'Room 302', type: 'lecture' },
  { id: 'fix-t3', subjectId: 'sub-fds', title: 'Data Structures Lab (Batch A1)', dayOfWeek: 2, startTime: '11:15', endTime: '13:15', location: 'IT Lab 2', type: 'lab' },
  { id: 'fix-t4', subjectId: 'sub-ps', title: 'Probability & Stats Tutorial', dayOfWeek: 2, startTime: '14:00', endTime: '15:00', location: 'Room 304', type: 'tutorial' },

  // Wednesday
  { id: 'fix-w1', subjectId: 'sub-coa', title: 'COA Architecture Lecture', dayOfWeek: 3, startTime: '09:00', endTime: '10:00', location: 'Room 305', type: 'lecture' },
  { id: 'fix-w2', subjectId: 'sub-fds', title: 'Fundamentals of Data Structures', dayOfWeek: 3, startTime: '10:00', endTime: '11:00', location: 'Room 201', type: 'lecture' },
  { id: 'fix-w3', subjectId: 'sub-dti', title: 'Design Thinking Workshop', dayOfWeek: 3, startTime: '11:15', endTime: '13:15', location: 'Innovation Hub', type: 'lab' },
  { id: 'fix-w4', subjectId: 'sub-os', title: 'OS Process Management Lecture', dayOfWeek: 3, startTime: '14:00', endTime: '15:00', location: 'Room 302', type: 'lecture' },

  // Thursday
  { id: 'fix-th1', subjectId: 'sub-sed', title: 'Software Engineering Design Models', dayOfWeek: 4, startTime: '09:00', endTime: '10:00', location: 'Seminar Hall B', type: 'lecture' },
  { id: 'fix-th2', subjectId: 'sub-ps', title: 'Probability & Random Variables', dayOfWeek: 4, startTime: '10:00', endTime: '11:00', location: 'Room 304', type: 'lecture' },
  { id: 'fix-th3', subjectId: 'sub-os', title: 'OS Kernel & Shell Lab (Batch A1)', dayOfWeek: 4, startTime: '11:15', endTime: '13:15', location: 'Systems Lab', type: 'lab' },
  { id: 'fix-th4', subjectId: 'sub-coa', title: 'COA Memory & Cache Tutorial', dayOfWeek: 4, startTime: '14:00', endTime: '15:00', location: 'Room 305', type: 'tutorial' },

  // Friday
  { id: 'fix-f1', subjectId: 'sub-fds', title: 'FDS Advanced Trees & Graphs', dayOfWeek: 5, startTime: '09:00', endTime: '10:00', location: 'Room 201', type: 'lecture' },
  { id: 'fix-f2', subjectId: 'sub-sed', title: 'SE&D Testing & Deployment', dayOfWeek: 5, startTime: '10:00', endTime: '11:00', location: 'Seminar Hall B', type: 'lecture' },
  { id: 'fix-f3', subjectId: 'sub-ec', title: 'Club Activity / Sports / Hackathon Prep', dayOfWeek: 5, startTime: '14:00', endTime: '16:00', location: 'Campus Hub', type: 'club' }
];
