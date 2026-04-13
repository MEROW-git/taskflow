import { Archive, RotateCcw, Trash2 } from 'lucide-react';
import { TaskCard } from '@/components/ui-custom/TaskCard';
import { EmptyState } from '@/components/ui-custom/EmptyState';
import { useTaskStore } from '@/store/taskStore';
import { toast } from '@/components/ui-custom/ToastContainer';

export const ArchivedTasks = () => {
  const { getTasksByStatus, unarchiveTask, deleteTask } = useTaskStore();
  
  const tasks = getTasksByStatus('archived');

  const handleUnarchive = (taskId: string) => {
    unarchiveTask(taskId);
    toast.success('Task restored');
  };

  const handleDelete = (taskId: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      deleteTask(taskId);
      toast.success('Task deleted permanently');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Archive className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Archived Tasks
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {tasks.length} archived task{tasks.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          Archived tasks are hidden from your main task list. You can restore them anytime.
        </p>
      </div>

      {/* Tasks Grid */}
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="relative group">
              <TaskCard task={task} />
              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleUnarchive(task.id)}
                  className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md"
                  title="Restore task"
                >
                  <RotateCcw className="w-4 h-4 text-green-600" />
                </button>
                <button
                  onClick={() => handleDelete(task.id, task.title)}
                  className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md"
                  title="Delete permanently"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState type="archived" />
      )}
    </div>
  );
};
