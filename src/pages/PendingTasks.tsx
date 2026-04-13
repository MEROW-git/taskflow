import { Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/ui-custom/TaskCard';
import { EmptyState } from '@/components/ui-custom/EmptyState';
import { useTaskStore } from '@/store/taskStore';

export const PendingTasks = () => {
  const { getTasksByStatus, openAddModal } = useTaskStore();
  const tasks = getTasksByStatus('pending').filter(t => !t.isArchived);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Pending Tasks
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {tasks.length} pending task{tasks.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <Button 
          onClick={openAddModal}
          className="bg-violet-600 hover:bg-violet-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Tasks Grid */}
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <EmptyState type="pending" />
      )}
    </div>
  );
};
