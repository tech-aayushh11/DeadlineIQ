import React from 'react';
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { TopNav } from './components/header/TopNav';
import { CalendarPage } from './pages/CalendarPage';
import { TasksPage } from './pages/TasksPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { WorkloadPage } from './pages/WorkloadPage';
import { PredictorPage } from './pages/PredictorPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { TaskModal } from './components/modals/TaskModal';
import { RiskExplanationModal } from './components/modals/RiskExplanationModal';
import { AutoScheduleModal } from './components/modals/AutoScheduleModal';
import { QuickSearchModal } from './components/modals/QuickSearchModal';

export const App: React.FC = () => {
  return (
    <HashRouter>
      <AppProvider>
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-white dark:bg-[#111317] text-gray-900 dark:text-gray-100 font-sans antialiased">
          {/* Top Compact Navigation Bar */}
          <TopNav />

          {/* Application Workspace Routes */}
          <main className="flex-1 flex overflow-hidden relative">
            <Routes>
              <Route path="/" element={<CalendarPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/subjects" element={<SubjectsPage />} />
              <Route path="/workload" element={<WorkloadPage />} />
              <Route path="/predictor" element={<PredictorPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Interactive Modals */}
          <TaskModal />
          <RiskExplanationModal />
          <AutoScheduleModal />
          <QuickSearchModal />
        </div>
      </AppProvider>
    </HashRouter>
  );
};

export default App;
