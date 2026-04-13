import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { useTaskStore } from '@/store/taskStore';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { TaskType, TaskPriority, TaskStatus, ChecklistItem } from '@/types/task';
import { v4 as uuidv4 } from 'uuid';
import { CalendarIcon } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const TASK_TYPES: { value: TaskType; label: string }[] = [
  { value: 'basic', label: 'Basic Task' },
  { value: 'checklist', label: 'Checklist Task' },
  { value: 'dueDate', label: 'Due Date Task' },
  { value: 'recurring', label: 'Recurring Task' },
  { value: 'note', label: 'Note Task' },
];

const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const CATEGORIES = ['personal', 'work', 'shopping', 'health', 'education', 'finance'];

export const TaskModal = () => {
  const { isTaskModalOpen, editingTask, closeTaskModal, addTask, updateTask } = useTaskStore();
  const { t, labelTaskType, labelPriority, labelCategory } = useI18n();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('basic');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [category, setCategory] = useState('personal');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringPattern, setRecurringPattern] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Reset form when modal opens/closes or editing task changes
  useEffect(() => {
    if (isTaskModalOpen) {
      if (editingTask) {
        setTitle(editingTask.title);
        setDescription(editingTask.description);
        setTaskType(editingTask.taskType);
        setPriority(editingTask.priority);
        setStatus(editingTask.status);
        setDueDate(editingTask.dueDate ? new Date(editingTask.dueDate) : undefined);
        setCategory(editingTask.category);
        setChecklist(editingTask.checklist);
        setIsPinned(editingTask.isPinned);
        setNoteContent(editingTask.noteContent || '');
        setIsRecurring(editingTask.isRecurring || false);
        setRecurringPattern((editingTask.recurringPattern as 'daily' | 'weekly' | 'monthly') || 'weekly');
      } else {
        // Reset to defaults for new task
        setTitle('');
        setDescription('');
        setTaskType('basic');
        setPriority('medium');
        setStatus('pending');
        setDueDate(undefined);
        setCategory('personal');
        setChecklist([]);
        setNewChecklistItem('');
        setIsPinned(false);
        setNoteContent('');
        setIsRecurring(false);
        setRecurringPattern('weekly');
      }
    }
  }, [isTaskModalOpen, editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      taskType,
      priority,
      status,
      dueDate: dueDate?.toISOString() || null,
      category,
      checklist,
      isPinned,
      noteContent: taskType === 'note' ? noteContent : undefined,
      isRecurring: taskType === 'recurring' ? isRecurring : undefined,
      recurringPattern: taskType === 'recurring' ? recurringPattern : undefined,
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }

    closeTaskModal();
  };

  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    
    const item: ChecklistItem = {
      id: uuidv4(),
      text: newChecklistItem.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    setChecklist([...checklist, item]);
    setNewChecklistItem('');
  };

  const removeChecklistItem = (id: string) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  return (
    <Dialog open={isTaskModalOpen} onOpenChange={closeTaskModal}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingTask ? t('taskModal.editTask') : t('taskModal.addNewTask')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">{t('taskModal.title')}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('taskModal.titlePlaceholder')}
              className="w-full"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t('taskModal.description')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('taskModal.descriptionPlaceholder')}
              rows={3}
            />
          </div>

          {/* Task Type & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('taskModal.taskType')}</Label>
              <Select value={taskType} onValueChange={(v) => setTaskType(v as TaskType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {labelTaskType(type.value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('taskModal.priority')}</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {labelPriority(p.value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('taskModal.dueDate')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start rounded-xl border-gray-200 bg-white text-left font-normal shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800',
                      !dueDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, 'PPP') : t('taskModal.pickDate')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={8}
                  className="w-auto rounded-2xl border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-gray-900"
                >
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    className="rounded-xl bg-transparent p-0"
                    classNames={{
                      root: 'w-fit',
                      month: 'w-full gap-3',
                      month_caption: 'flex h-10 items-center justify-center px-10',
                      caption_label: 'text-sm font-semibold text-gray-900 dark:text-gray-100',
                      nav: 'absolute inset-x-0 top-0 flex items-center justify-between',
                      button_previous:
                        'h-8 w-8 rounded-full border border-gray-200 bg-white p-0 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
                      button_next:
                        'h-8 w-8 rounded-full border border-gray-200 bg-white p-0 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
                      weekdays: 'mt-2 grid grid-cols-7 gap-1',
                      weekday:
                        'flex h-8 items-center justify-center text-[0.75rem] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500',
                      week: 'mt-1 grid grid-cols-7 gap-1',
                      day: 'h-10 w-10 p-0',
                      today:
                        'rounded-full bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
                    }}
                    components={{
                      DayButton: ({ className, ...props }) => (
                        <button
                          {...props}
                          className={cn(
                            'h-10 w-10 rounded-full text-sm font-medium text-gray-700 transition-colors hover:bg-violet-50 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:text-gray-200 dark:hover:bg-violet-900/30 dark:hover:text-violet-300',
                            'aria-selected:bg-violet-600 aria-selected:text-white dark:aria-selected:bg-violet-500',
                            className
                          )}
                        />
                      ),
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>{t('taskModal.category')}</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {labelCategory(cat)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Checklist Section */}
          {taskType === 'checklist' && (
            <div className="space-y-3">
              <Label>{t('taskModal.checklistItems')}</Label>
              
              {/* Add new item */}
              <div className="flex gap-2">
                <Input
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  placeholder={t('taskModal.checklistPlaceholder')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addChecklistItem();
                    }
                  }}
                />
                <Button type="button" onClick={addChecklistItem} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Checklist items */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleChecklistItem(item.id)}
                    />
                    <span className={cn(
                      'flex-1 text-sm',
                      item.completed && 'line-through text-gray-500'
                    )}>
                      {item.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeChecklistItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {checklist.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  {t('taskModal.noChecklistItems')}
                </p>
              )}
            </div>
          )}

          {/* Note Content Section */}
          {taskType === 'note' && (
            <div className="space-y-2">
              <Label htmlFor="noteContent">{t('taskModal.noteContent')}</Label>
              <Textarea
                id="noteContent"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder={t('taskModal.notePlaceholder')}
                rows={6}
                className="font-mono text-sm"
              />
            </div>
          )}

          {/* Recurring Options */}
          {taskType === 'recurring' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={isRecurring}
                  onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
                />
                <Label>{t('taskModal.enableRecurring')}</Label>
              </div>
              
              {isRecurring && (
                <Select value={recurringPattern} onValueChange={(v) => setRecurringPattern(v as 'daily' | 'weekly' | 'monthly')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Pin Task */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isPinned}
              onCheckedChange={(checked) => setIsPinned(checked as boolean)}
            />
            <Label>{t('taskModal.pinTask')}</Label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={closeTaskModal}>
              {t('common.cancel')}
            </Button>
            <Button 
              type="submit" 
              className="bg-violet-600 hover:bg-violet-700"
              disabled={!title.trim()}
            >
              {editingTask ? t('taskModal.updateTask') : t('common.addTask')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
