import { useState } from 'react';
import { Plus, Trash2, Archive, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/ui-custom/TaskCard';
import { FilterBar } from '@/components/ui-custom/FilterBar';
import { EmptyState } from '@/components/ui-custom/EmptyState';
import { useTaskStore } from '@/store/taskStore';
import { toast } from '@/components/ui-custom/ToastContainer';

export const AllTasks = () => {
  const { 
    getFilteredTasks, 
    openAddModal, 
    selectedTaskIds,
    toggleTaskSelection,
    selectAllTasks,
    deselectAllTasks,
    deleteTasks,
    archiveTask,
    toggleTaskComplete
  } = useTaskStore();

  const [selectionMode, setSelectionMode] = useState(false);

  const tasks = getFilteredTasks();
  const hasSelection = selectedTaskIds.length > 0;
  const allSelected = tasks.length > 0 && selectedTaskIds.length === tasks.length;

  const handleSelectAll = () => {
    if (allSelected) {
      deselectAllTasks();
    } else {
      selectAllTasks();
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedTaskIds.length} tasks?`)) {
      deleteTasks(selectedTaskIds);
      toast.success(`Deleted ${selectedTaskIds.length} tasks`);
      setSelectionMode(false);
    }
  };

  const handleBulkArchive = () => {
    selectedTaskIds.forEach(id => archiveTask(id));
    toast.success(`Archived ${selectedTaskIds.length} tasks`);
    setSelectionMode(false);
  };

  const handleBulkComplete = () => {
    selectedTaskIds.forEach(id => toggleTaskComplete(id));
    toast.success(`Marked ${selectedTaskIds.length} tasks as completed`);
    setSelectionMode(false);
  };

  if (tasks.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              All Tasks
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage and organize all your tasks
            </p>
          </div>
          <Button 
            onClick={openAddModal}
            className="bg-violet-600 hover:bg-violet-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        <FilterBar />
        <EmptyState type="all" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            All Tasks
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectionMode ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectionMode(false);
                  deselectAllTasks();
                }}
              >
                Cancel
              </Button>
              {hasSelection && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleBulkComplete}
                    className="text-green-600"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Complete
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleBulkArchive}
                    className="text-amber-600"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleBulkDelete}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setSelectionMode(true)}
              >
                Select
              </Button>
              <Button 
                onClick={openAddModal}
                className="bg-violet-600 hover:bg-violet-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar />

      {/* Selection Bar */}
      {selectionMode && (
        <div className="flex items-center justify-between p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {selectedTaskIds.length} selected
            </span>
          </div>
        </div>
      )}

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            showCheckbox={selectionMode}
            isSelected={selectedTaskIds.includes(task.id)}
            onSelect={toggleTaskSelection}
          />
        ))}
      </div>
    </div>
  );
};
