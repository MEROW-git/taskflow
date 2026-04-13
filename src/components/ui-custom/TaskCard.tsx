import { 
  CheckCircle2, 
  Circle, 
  Pin, 
  PinOff,
  Calendar, 
  MoreVertical,
  Edit2,
  Copy,
  Archive,
  Trash2,
  ListChecks,
  Repeat,
  StickyNote,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTaskStore } from '@/store/taskStore';
import { useSettingsStore } from '@/store/settingsStore';
import { formatDate, getDueDateStatus } from '@/utils/dateUtils';
import { 
  PRIORITY_COLORS, 
  PRIORITY_LABELS, 
  TASK_TYPE_LABELS,
  type Task,
} from '@/types/task';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  showCheckbox?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export const TaskCard = ({ 
  task, 
  showCheckbox = false,
  isSelected = false,
  onSelect 
}: TaskCardProps) => {
  const { 
    toggleTaskComplete, 
    toggleTaskPin, 
    archiveTask, 
    unarchiveTask, 
    duplicateTask, 
    deleteTask,
    openEditModal 
  } = useTaskStore();
  const { confirmBeforeDelete } = useSettingsStore();

  const dueDateStatus = getDueDateStatus(task.dueDate, task.status);
  const completedChecklistItems = task.checklist.filter(item => item.completed).length;
  const totalChecklistItems = task.checklist.length;
  const checklistProgress = totalChecklistItems > 0 
    ? Math.round((completedChecklistItems / totalChecklistItems) * 100) 
    : 0;

  const handleDelete = () => {
    if (confirmBeforeDelete) {
      if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
        deleteTask(task.id);
      }
    } else {
      deleteTask(task.id);
    }
  };

  const handleDuplicate = () => {
    duplicateTask(task.id);
  };

  const getTaskTypeIcon = () => {
    switch (task.taskType) {
      case 'checklist':
        return <ListChecks className="w-4 h-4" />;
      case 'recurring':
        return <Repeat className="w-4 h-4" />;
      case 'note':
        return <StickyNote className="w-4 h-4" />;
      case 'dueDate':
        return <Calendar className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <Card
      className={cn(
        'group relative p-4 transition-all duration-200',
        'hover:shadow-md hover:-translate-y-0.5',
        'border border-gray-200 dark:border-gray-700',
        'bg-white dark:bg-gray-800',
        task.status === 'completed' && 'opacity-75',
        task.isPinned && 'ring-1 ring-violet-500 dark:ring-violet-400',
        isSelected && 'ring-2 ring-violet-500 dark:ring-violet-400'
      )}
    >
      {/* Selection Checkbox */}
      {showCheckbox && (
        <div className="absolute top-3 left-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect?.(task.id)}
            className="border-gray-300 dark:border-gray-600"
          />
        </div>
      )}

      <div className={cn(showCheckbox && 'pl-8')}>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Complete Toggle */}
            <button
              onClick={() => toggleTaskComplete(task.id)}
              className={cn(
                'flex-shrink-0 transition-colors',
                task.status === 'completed' 
                  ? 'text-green-500 hover:text-green-600' 
                  : 'text-gray-400 hover:text-gray-500'
              )}
            >
              {task.status === 'completed' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>
            
            {/* Title */}
            <h3 
              className={cn(
                'font-medium text-gray-900 dark:text-gray-100 truncate',
                task.status === 'completed' && 'line-through text-gray-500 dark:text-gray-400'
              )}
              title={task.title}
            >
              {task.title}
            </h3>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Pin Button */}
            <button
              onClick={() => toggleTaskPin(task.id)}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                task.isPinned 
                  ? 'text-violet-600 bg-violet-50 dark:bg-violet-900/20' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              {task.isPinned ? (
                <Pin className="w-4 h-4" />
              ) : (
                <PinOff className="w-4 h-4" />
              )}
            </button>
            
            {/* More Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => openEditModal(task)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {task.isArchived ? (
                  <DropdownMenuItem onClick={() => unarchiveTask(task.id)}>
                    <Archive className="w-4 h-4 mr-2" />
                    Unarchive
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => archiveTask(task.id)}>
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Description */}
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {task.description}
          </p>
        )}
        
        {/* Checklist Progress */}
        {task.taskType === 'checklist' && totalChecklistItems > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span className="flex items-center gap-1">
                <ListChecks className="w-3.5 h-3.5" />
                Checklist
              </span>
              <span>{completedChecklistItems}/{totalChecklistItems}</span>
            </div>
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-violet-500 rounded-full transition-all duration-300"
                style={{ width: `${checklistProgress}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Left: Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Priority Badge */}
            <Badge 
              variant="secondary"
              className="text-xs"
              style={{ 
                backgroundColor: `${PRIORITY_COLORS[task.priority]}20`,
                color: PRIORITY_COLORS[task.priority],
                borderColor: `${PRIORITY_COLORS[task.priority]}40`
              }}
            >
              {PRIORITY_LABELS[task.priority]}
            </Badge>
            
            {/* Category Badge */}
            {task.category && (
              <Badge 
                variant="outline" 
                className="text-xs text-gray-600 dark:text-gray-400"
              >
                {task.category}
              </Badge>
            )}
            
            {/* Task Type Icon */}
            {getTaskTypeIcon() && (
              <span className="text-gray-400" title={TASK_TYPE_LABELS[task.taskType]}>
                {getTaskTypeIcon()}
              </span>
            )}
          </div>
          
          {/* Right: Due Date */}
          {task.dueDate && (
            <div 
              className={cn(
                'flex items-center gap-1 text-xs',
                dueDateStatus.isOverdue && 'text-red-600 dark:text-red-400',
                dueDateStatus.isUrgent && !dueDateStatus.isOverdue && 'text-amber-600 dark:text-amber-400',
                !dueDateStatus.isOverdue && !dueDateStatus.isUrgent && 'text-gray-500 dark:text-gray-400'
              )}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(task.dueDate)}</span>
              {dueDateStatus.label && (
                <span className="font-medium">({dueDateStatus.label})</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
