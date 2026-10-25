export type CourseType = 'Theory' | 'Tutorial' | 'Lab' | 'Practical' | 'Activity';

export interface ResourceItem {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'code' | 'video' | 'notes' | 'link';
  fileSize?: string;
  url?: string;
  category: 'manual' | 'syllabus' | 'video' | 'experiment' | 'notes' | 'cheatsheet';
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  shortName: string;
  component: CourseType;
  credits: number;
  color: string; // Hex color for calendar blocks
  textColor: string;
  badgeBg: string;
  facultyName: string;
  classroom?: string;
  resources: ResourceItem[];
}

export interface StudentProfile {
  name: string;
  prn: string; // Permanent Registration Number
  institution: string;
  program: string;
  academicYear: string;
  semester: number;
  division: string;
  rollNo: string;
  avatarUrl?: string;
}
