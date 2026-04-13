import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { TaskModal } from '@/components/ui-custom/TaskModal';
import { ToastContainer } from '@/components/ui-custom/ToastContainer';
import { useSettingsStore } from '@/store/settingsStore';
import { useTaskStore } from '@/store/taskStore';
import { sampleTasks } from '@/data/sampleTasks';
import { cn } from '@/lib/utils';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sidebarCollapsed } = useSettingsStore();
  const { tasks, addTask } = useTaskStore();

  // Initialize sample tasks if no tasks exist
  useEffect(() => {
    if (tasks.length === 0) {
      // Add sample tasks one by one
      sampleTasks.forEach((task) => {
        addTask(task);
      });
    }
  }, []);

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
