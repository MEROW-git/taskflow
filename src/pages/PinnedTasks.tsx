import { Pin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/ui-custom/TaskCard';
import { EmptyState } from '@/components/ui-custom/EmptyState';
import { useTaskStore } from '@/store/taskStore';
import { useI18n } from '@/lib/i18n';

export const PinnedTasks = () => {
  const { t } = useI18n();
  const { getPinnedTasks, openAddModal } = useTaskStore();
  
  const tasks = getPinnedTasks();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <Pin className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('tasksPage.pinnedTasks')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {t('tasksPage.pinnedCount', {
                count: tasks.length,
                taskWord: tasks.length === 1 ? t('common.task') : t('common.tasks'),
              })}
            </p>
          </div>
        </div>
        <Button 
          onClick={openAddModal}
          className="bg-violet-600 hover:bg-violet-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('common.addTask')}
        </Button>
      </div>

      {/* Info Banner */}
      <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-200 dark:border-violet-800">
        <p className="text-sm text-violet-800 dark:text-violet-200">
          {t('tasksPage.pinnedInfo')}
        </p>
      </div>

      {/* Tasks Grid */}
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <EmptyState type="pinned" />
      )}
    </div>
  );
};
