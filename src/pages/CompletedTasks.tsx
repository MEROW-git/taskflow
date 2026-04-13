import { CheckCircle2, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/ui-custom/TaskCard';
import { EmptyState } from '@/components/ui-custom/EmptyState';
import { useTaskStore } from '@/store/taskStore';
import { toast } from '@/components/ui-custom/ToastContainer';
import { useI18n } from '@/lib/i18n';

export const CompletedTasks = () => {
  const { t } = useI18n();
  const { getTasksByStatus, toggleTaskComplete, clearCompleted } = useTaskStore();
  
  const tasks = getTasksByStatus('completed').filter(t => !t.isArchived);

  const handleClearAll = () => {
    if (window.confirm(t('tasksPage.confirmClearCompleted', { count: tasks.length }))) {
      clearCompleted();
      toast.success(t('tasksPage.allCompletedCleared'));
    }
  };

  const handleUndoComplete = (taskId: string) => {
    toggleTaskComplete(taskId);
    toast.success(t('tasksPage.taskMarkedPending'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('tasksPage.completedTasks')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {t('tasksPage.completedCount', {
                count: tasks.length,
                taskWord: tasks.length === 1 ? t('common.task') : t('common.tasks'),
              })}
            </p>
          </div>
        </div>
        
        {tasks.length > 0 && (
          <Button 
            variant="outline"
            onClick={handleClearAll}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t('tasksPage.clearAll')}
          </Button>
        )}
      </div>

      {/* Tasks Grid */}
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="relative group">
              <TaskCard task={task} />
              {/* Undo Button */}
              <button
                onClick={() => handleUndoComplete(task.id)}
                className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                title={t('tasksPage.markIncomplete')}
              >
                <RotateCcw className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState type="completed" />
      )}
    </div>
  );
};
