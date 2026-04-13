import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { TaskModal } from '@/components/ui-custom/TaskModal';
import { ToastContainer } from '@/components/ui-custom/ToastContainer';
import { useSettingsStore } from '@/store/settingsStore';
import { useTaskStore } from '@/store/taskStore';
import { cn } from '@/lib/utils';
import { sendBrowserNotification } from '@/utils/notificationUtils';
import { useI18n } from '@/lib/i18n';

const NOTIFIED_TASKS_KEY = 'flowtask-notified-tasks';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sidebarCollapsed, hasCompletedOnboarding, enableNotifications, dueDateReminders, reminderTime } = useSettingsStore();
  const { tasks } = useTaskStore();
  const { t } = useI18n();

  if (!hasCompletedOnboarding) {
    return <Navigate to="/welcome" replace />;
  }

  useEffect(() => {
    if (!enableNotifications || !dueDateReminders || typeof window === 'undefined') {
      return;
    }

    const checkReminders = () => {
      if (Notification.permission !== 'granted') return;

      const now = Date.now();
      const notifiedTaskIds = new Set<string>(
        JSON.parse(window.localStorage.getItem(NOTIFIED_TASKS_KEY) ?? '[]')
      );
      let hasUpdates = false;

      tasks.forEach((task) => {
        if (task.status === 'completed' || task.status === 'archived' || !task.dueDate) {
          return;
        }

        const dueTime = new Date(task.dueDate).getTime();
        const msUntilDue = dueTime - now;
        const shouldNotify = msUntilDue > 0 && msUntilDue <= reminderTime * 60 * 1000;

        if (shouldNotify && !notifiedTaskIds.has(task.id)) {
          const sent = sendBrowserNotification(t('notifications.dueSoonTitle', { title: task.title }), {
            body: t('notifications.dueSoonBody', {
              date: new Date(task.dueDate).toLocaleString(),
            }),
          });

          if (sent) {
            notifiedTaskIds.add(task.id);
            hasUpdates = true;
          }
        }
      });

      if (hasUpdates) {
        window.localStorage.setItem(
          NOTIFIED_TASKS_KEY,
          JSON.stringify([...notifiedTaskIds])
        );
      }
    };

    checkReminders();
    const intervalId = window.setInterval(checkReminders, 60 * 1000);
    return () => window.clearInterval(intervalId);
  }, [enableNotifications, dueDateReminders, reminderTime, tasks]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      {/* Main Content */}
      <div className={cn(
        'transition-all duration-300',
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      )}>
        {/* Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
      
      {/* Task Modal */}
      <TaskModal />
      
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};
