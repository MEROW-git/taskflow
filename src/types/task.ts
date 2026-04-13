// Task Types and Interfaces

export type TaskType = 
  | 'basic' 
  | 'checklist' 
  | 'dueDate' 
  | 'recurring' 
  | 'pinned' 
  | 'note';

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'archived';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type RecurringPattern = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  taskType: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  category: string;
  checklist: ChecklistItem[];
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  // Recurring task fields
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
  recurringDays?: number[]; // 0-6 for weekly (Sunday-Saturday)
  recurringDayOfMonth?: number; // 1-31 for monthly
  // Note task fields
  noteContent?: string;
  // Completion tracking
  completedAt?: string | null;
}

export interface TaskFilter {
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  category: string;
  taskType: TaskType | 'all';
  searchQuery: string;
}

export type SortOption = 
  | 'newest' 
  | 'oldest' 
  | 'dueDate' 
  | 'priority' 
  | 'alphabetical';

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  overdue: number;
  pinned: number;
  archived: number;
  completionPercentage: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: 'Work', color: '#7B61FF' },
  { id: 'personal', name: 'Personal', color: '#10B981' },
  { id: 'shopping', name: 'Shopping', color: '#F59E0B' },
  { id: 'health', name: 'Health', color: '#EF4444' },
  { id: 'education', name: 'Education', color: '#3B82F6' },
  { id: 'finance', name: 'Finance', color: '#8B5CF6' },
];

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#EF4444',
  urgent: '#DC2626',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  pending: '#6B7280',
  'in-progress': '#3B82F6',
  completed: '#10B981',
  archived: '#9CA3AF',
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
  archived: 'Archived',
};

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  basic: 'Basic Task',
  checklist: 'Checklist Task',
  dueDate: 'Due Date Task',
  recurring: 'Recurring Task',
  pinned: 'Pinned Task',
  note: 'Note Task',
};

export const TASK_TYPE_ICONS: Record<TaskType, string> = {
  basic: 'CheckCircle',
  checklist: 'ListChecks',
  dueDate: 'Calendar',
  recurring: 'Repeat',
  pinned: 'Pin',
  note: 'StickyNote',
};
