import { HashRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Dashboard } from '@/pages/Dashboard';
import { AllTasks } from '@/pages/AllTasks';
import { PendingTasks } from '@/pages/PendingTasks';
import { CompletedTasks } from '@/pages/CompletedTasks';
import { ArchivedTasks } from '@/pages/ArchivedTasks';
import { PinnedTasks } from '@/pages/PinnedTasks';
import { Settings } from '@/pages/Settings';
import { Welcome } from '@/pages/Welcome';
import './App.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<AllTasks />} />
          <Route path="pending" element={<PendingTasks />} />
          <Route path="completed" element={<CompletedTasks />} />
          <Route path="archived" element={<ArchivedTasks />} />
          <Route path="pinned" element={<PinnedTasks />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
