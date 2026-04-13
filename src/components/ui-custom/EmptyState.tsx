import { ListTodo, CheckCircle2, Clock, Archive, Pin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/store/taskStore';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  type?: 'all' | 'completed' | 'pending' | 'archived' | 'pinned' | 'search' | 'filtered';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const emptyStateConfigs = {
  all: {
    icon: ListTodo,
    title: 'No tasks yet',
    description: 'Get started by creating your first task. Stay organized and get things done!',
    actionLabel: 'Create Task',
  },
  completed: {
    icon: CheckCircle2,
    title: 'No completed tasks',
    description: 'You haven\'t completed any tasks yet. Keep going!',
    actionLabel: 'View All Tasks',
  },
  pending: {
    icon: Clock,
    title: 'No pending tasks',
    description: 'Great job! You have no pending tasks at the moment.',
    actionLabel: 'Create Task',
  },
  archived: {
    icon: Archive,
    title: 'No archived tasks',
    description: 'Archived tasks will appear here.',
    actionLabel: 'View All Tasks',
  },
  pinned: {
    icon: Pin,
    title: 'No pinned tasks',
    description: 'Pin important tasks to keep them at the top of your list.',
    actionLabel: 'View All Tasks',
  },
  search: {
    icon: Search,
    title: 'No results found',
    description: 'Try adjusting your search terms or filters.',
    actionLabel: 'Clear Filters',
  },
  filtered: {
    icon: ListTodo,
    title: 'No tasks match',
    description: 'Try adjusting your filters to see more tasks.',
    actionLabel: 'Clear Filters',
  },
};

export const EmptyState = ({ 
  type = 'all',
  title: customTitle,
  description: customDescription,
  actionLabel: customActionLabel,
  onAction 
}: EmptyStateProps) => {
  const { openAddModal, resetFilters } = useTaskStore();
  
  const config = emptyStateConfigs[type];
  const Icon = config.icon;
  
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (type === 'search' || type === 'filtered') {
      resetFilters();
    } else if (type === 'all' || type === 'pending') {
      openAddModal();
    }
  };

  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-16 px-4',
      'text-center'
    )}>
      <div className={cn(
        'w-20 h-20 rounded-full flex items-center justify-center mb-6',
        'bg-gray-100 dark:bg-gray-800'
      )}>
        <Icon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {customTitle || config.title}
      </h3>
      
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
        {customDescription || config.description}
      </p>
      
      <Button
        onClick={handleAction}
        className="bg-violet-600 hover:bg-violet-700 text-white"
      >
        {customActionLabel || config.actionLabel}
      </Button>
    </div>
  );
};
