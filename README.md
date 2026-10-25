# DeadlineIQ ⏱️ 📅
> **Motion-Style Smart Academic Deadline & Workload Predictor**  
> Tailored for Engineering Students at **Rajarshi Shahu College of Engineering (RSCOE), Tathawade, Pune** (B.Tech Information Technology Engineering, Semester 1).

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌟 Overview

**DeadlineIQ** reproduces the exact visual philosophy, density, calendar time-blocking, task sidebar, and scheduling interaction patterns of **Motion**, transformed into an academic productivity suite. 

Rather than functioning as a generic SaaS dashboard with oversized KPI cards, **DeadlineIQ puts the calendar at the center of the workspace**, pairing an interactive hourly time-grid with an integrated mathematical deadline prediction engine and AI-style auto-scheduler.

---

## ✨ Key Features

### 1. 📅 Motion-Grade Interactive Calendar
- **Full Viewport Two-Panel Workspace**:
  - **Left Panel (280–320px)**: Persistent Task Sidebar with quick task creation, Motion status banner (`2 tasks past due` alert / `All tasks scheduled on-time`), search & subject filters, and collapsible groups (*Overdue*, *Today*, *Upcoming*, *Unscheduled*, and *Completed*).
  - **Right Panel**: Interactive time-blocked calendar grid supporting **Day**, **Week**, and **Month** views.
- **Accurate Time-Blocking**: 52px hourly slots (7:00 AM – 11:00 PM) with vertical positioning reflecting duration, collision handling for concurrent items, and an animated current-time red line indicator.
- **Fixed Academic vs. Flexible Sessions**: Differentiates between fixed RSCOE college timetable lectures and auto-scheduled study sessions.
- **Empty Slot Interaction**: Click any empty hour slot on the calendar grid to immediately open the task editor pre-filled with that time block.

### 2. ⚡ Motion Task Creation Panel
- Reproduces Motion's exact compact task modal:
  - Breadcrumb header (`Tasks (RSCOE IT) > Subject`) with close and pin controls.
  - Title and auto-expanding description.
  - Compact attribute pills: `⏱ Duration` (15m to 3h), `📚 Subject`, `🚩 Priority`, `📅 Due Date & Time`, `⚡ Difficulty` (with effort multipliers), and `○ Status`.
  - `● Hard Deadline` toggle with clear academic cutoff explanation.
  - Subtask checklist manager with inline item addition.
  - `✦ Auto-scheduled` purple toggle and keyboard shortcut (`Esc`).

### 3. 🎯 Deterministic Smart Deadline Risk Predictor
- Embedded directly into calendar blocks, sidebar rows, and a dedicated prediction workbench.
- Calculates:
  - $\text{Remaining Effort} = \text{Estimated Duration} \times (1 - \text{Progress}) \times \text{Difficulty Multiplier}$
  - $\text{Available Study Hours} = \text{Free Hours outside RSCOE lectures before deadline}$
  - $\text{Competing Workload} = \text{Active tasks due concurrently}$
  - $\text{Urgency Ratio} = \frac{\text{Remaining Effort} + 0.45 \times \text{Competing Workload}}{\text{Available Study Hours}}$
- Categorizes risk into **Low**, **Moderate**, **High**, and **Critical** tiers with explicit diagnostic reasons and actionable advice.

### 4. 🤖 Auto-Scheduling Engine
- Scans open study windows around college lectures (Weekdays 4:30 PM – 10:00 PM; Weekends 9:30 AM – 9:00 PM).
- Generates non-conflicting time blocks before task deadlines.
- Displays an **Auto-Schedule Proposals Modal** previewing proposed start/end times and risk improvement transitions (e.g., *Critical* $\rightarrow$ *On Track*) with overload warnings before applying changes.

### 5. 🏛️ RSCOE B.Tech IT Academic Data & Resource Library
- **Pre-Configured Courses (Semester 1)**:
  1. `BAS-101`: *Probability and Statistics*
  2. `PCC-IT101`: *Computer Organization and Architecture*
  3. `PCC-IT102`: *Software Engineering and Design*
  4. `PCC-IT103`: *Fundamentals of Data Structure*
  5. `PCC-IT104`: *Operating Systems*
  6. `MC-101`: *Design Thinking and Innovation*
  7. `LC-IT101`: *Programming Lab-I: Python*
  8. `AC-101`: *Extra-Curricular (Hackathon/NSS/Sports/Club Activity)*
- **Python Lab Resource Repository**: Includes official course materials (`PL 1 lab manual`, `Lab manual`, `Syllabus`, `NPTEL video`, `EXP. 1`, `Exp. 2`, `Python Operators`, `Exp.4`, `tuple`, and `list`).

### 6. 📊 Complete Application Routes
- `/calendar` — Motion 2-panel calendar and task manager.
- `/tasks` — Full table view with filters by subject, status, priority, and risk sorting.
- `/subjects` — Course syllabus, credits, faculty, classroom details, and resource library.
- `/workload` — Recharts daily workload breakdown (Study vs. College) with capacity thresholds.
- `/predictor` — Deep-dive mathematical risk breakdown and simulation.
- `/analytics` — Completion rates, focus streaks, and subject progress tracking.
- `/settings` — Student profile, auto-scheduler parameters, dark/light theme, and JSON export/reset.

---

## 🛠️ Tech Stack

- **Core**: React 19, TypeScript 6, Vite 8
- **Styling**: Tailwind CSS v4, Vanilla CSS Design Tokens
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router DOM (HashRouter for zero-config routing)
- **State & Storage**: React Context API with LocalStorage persistence

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn` / `pnpm`

### Installation

```bash
# Clone the repository
git clone https://github.com/tech-aayushh11/DeadlineIQ.git

# Navigate to the project directory
cd DeadlineIQ

# Install dependencies
npm install

# Start the local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
# Build production bundle
npm run build

# Preview production build
npm run preview
```

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
