import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { 
  Task, 
  TaskType, 
  TaskStatus, 
  TaskPriority, 
  TaskFilter, 
  SortOption,
  TaskStats,
  ChecklistItem,
} from '@/types/task';
import { isPast, isToday, isTomorrow, parseISO } from 'date-fns';

interface TaskState {
  // Tasks
  tasks: Task[];
  
  // Filter & Sort
  filter: TaskFilter;
  sortBy: SortOption;
  
  // UI State
  selectedTaskIds: string[];
  isTaskModalOpen: boolean;
  editingTask: Task | null;
  
  // Actions
  addTask: (taskData: Partial<Task>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  deleteTasks: (ids: string[]) => void;
  duplicateTask: (id: string) => Task;
  toggleTaskComplete: (id: string) => void;
  toggleTaskPin: (id: string) => void;
  archiveTask: (id: string) => void;
  unarchiveTask: (id: string) => void;
  clearCompleted: () => void;
  clearAll: () => void;
  
  // Checklist actions
  addChecklistItem: (taskId: string, text: string) => void;
  updateChecklistItem: (taskId: string, itemId: string, updates: Partial<ChecklistItem>) => void;
  deleteChecklistItem: (taskId: string, itemId: string) => void;
  toggleChecklistItem: (taskId: string, itemId: string) => void;
  
  // Filter & Sort actions
  setFilter: (filter: Partial<TaskFilter>) => void;
  setSortBy: (sort: SortOption) => void;
  resetFilters: () => void;
  
  // Selection actions
  toggleTaskSelection: (id: string) => void;
  selectAllTasks: () => void;
  deselectAllTasks: () => void;
  
  // Modal actions
  openAddModal: () => void;
  openEditModal: (task: Task) => void;
  closeTaskModal: () => void;
  
  // Import/Export
  exportTasks: () => string;
  importTasks: (jsonString: string) => { success: boolean; message: string };
  
  // Getters
  getFilteredTasks: () => Task[];
  getTaskStats: () => TaskStats;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getPinnedTasks: () => Task[];
  getOverdueTasks: () => Task[];
  getUpcomingTasks: () => Task[];
  getRecentTasks: () => Task[];
}

const createDefaultTask = (overrides: Partial<Task> = {}): Task => ({
  id: uuidv4(),
  title: '',
  description: '',
  taskType: 'basic' as TaskType,
  priority: 'medium' as TaskPriority,
  status: 'pending' as TaskStatus,
  dueDate: null,
  category: 'personal',
  checklist: [],
  isPinned: false,
  isArchived: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  completedAt: null,
  ...overrides,
});

const defaultFilter: TaskFilter = {
  status: 'all',
  priority: 'all',
  category: '',
  taskType: 'all',
  searchQuery: '',
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      filter: defaultFilter,
      sortBy: 'newest',
      selectedTaskIds: [],
      isTaskModalOpen: false,
      editingTask: null,

      addTask: (taskData) => {
        const newTask = createDefaultTask(taskData);
        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }));
        return newTask;
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          selectedTaskIds: state.selectedTaskIds.filter((taskId) => taskId !== id),
        }));
      },

      deleteTasks: (ids) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => !ids.includes(task.id)),
          selectedTaskIds: [],
        }));
      },

      duplicateTask: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) throw new Error('Task not found');
        
        const duplicatedTask = createDefaultTask({
          ...task,
          title: `${task.title} (Copy)`,
          status: 'pending',
          isPinned: false,
          isArchived: false,
          completedAt: null,
          checklist: task.checklist.map((item) => ({
            ...item,
            id: uuidv4(),
            completed: false,
          })),
        });
        
        set((state) => ({
          tasks: [duplicatedTask, ...state.tasks],
        }));
        
        return duplicatedTask;
      },

      toggleTaskComplete: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;

        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        const completedAt = newStatus === 'completed' ? new Date().toISOString() : null;

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, status: newStatus, completedAt, updatedAt: new Date().toISOString() }
              : t
          ),
        }));
      },

      toggleTaskPin: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, isPinned: !task.isPinned, updatedAt: new Date().toISOString() }
              : task
          ),
        }));
      },

      archiveTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, isArchived: true, status: 'archived', updatedAt: new Date().toISOString() }
              : task
          ),
        }));
      },

      unarchiveTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, isArchived: false, status: 'pending', updatedAt: new Date().toISOString() }
              : task
          ),
        }));
      },

      clearCompleted: () => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.status !== 'completed'),
        }));
      },

      clearAll: () => {
        set({ tasks: [], selectedTaskIds: [] });
      },

      // Checklist actions
      addChecklistItem: (taskId, text) => {
        const newItem: ChecklistItem = {
          id: uuidv4(),
          text,
          completed: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, checklist: [...task.checklist, newItem], updatedAt: new Date().toISOString() }
              : task
          ),
        }));
      },

      updateChecklistItem: (taskId, itemId, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  checklist: task.checklist.map((item) =>
                    item.id === itemId ? { ...item, ...updates } : item
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }));
      },

      deleteChecklistItem: (taskId, itemId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  checklist: task.checklist.filter((item) => item.id !== itemId),
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }));
      },

      toggleChecklistItem: (taskId, itemId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  checklist: task.checklist.map((item) =>
                    item.id === itemId ? { ...item, completed: !item.completed } : item
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }));
      },

      // Filter & Sort actions
      setFilter: (filter) => {
        set((state) => ({
          filter: { ...state.filter, ...filter },
        }));
      },

      setSortBy: (sort) => {
        set({ sortBy: sort });
      },

      resetFilters: () => {
        set({ filter: defaultFilter });
      },

      // Selection actions
      toggleTaskSelection: (id) => {
        set((state) => ({
          selectedTaskIds: state.selectedTaskIds.includes(id)
            ? state.selectedTaskIds.filter((taskId) => taskId !== id)
            : [...state.selectedTaskIds, id],
        }));
      },

      selectAllTasks: () => {
        const filteredTasks = get().getFilteredTasks();
        set({ selectedTaskIds: filteredTasks.map((t) => t.id) });
      },

      deselectAllTasks: () => {
        set({ selectedTaskIds: [] });
      },

      // Modal actions
      openAddModal: () => {
        set({ isTaskModalOpen: true, editingTask: null });
      },

      openEditModal: (task) => {
        set({ isTaskModalOpen: true, editingTask: task });
      },

      closeTaskModal: () => {
        set({ isTaskModalOpen: false, editingTask: null });
      },

      // Import/Export
      exportTasks: () => {
        const data = {
          tasks: get().tasks,
          exportDate: new Date().toISOString(),
          version: '1.0',
        };
        return JSON.stringify(data, null, 2);
      },

      importTasks: (jsonString) => {
        try {
          const data = JSON.parse(jsonString);
          if (!data.tasks || !Array.isArray(data.tasks)) {
            return { success: false, message: 'Invalid file format' };
          }
          
          // Validate and sanitize imported tasks
          const validTasks = data.tasks.map((task: Task) => ({
            ...createDefaultTask(),
            ...task,
            id: task.id || uuidv4(),
            createdAt: task.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }));
          
          set((state) => ({
            tasks: [...validTasks, ...state.tasks],
          }));
          
          return { success: true, message: `Imported ${validTasks.length} tasks` };
        } catch (error) {
          return { success: false, message: 'Failed to parse file' };
        }
      },

      // Getters
      getFilteredTasks: () => {
        const { tasks, filter, sortBy } = get();
        
        let filtered = tasks.filter((task) => {
          // Search query
          if (filter.searchQuery) {
            const query = filter.searchQuery.toLowerCase();
            const matchesSearch = 
              task.title.toLowerCase().includes(query) ||
              task.description.toLowerCase().includes(query) ||
              task.category.toLowerCase().includes(query);
            if (!matchesSearch) return false;
          }
          
          // Status filter
          if (filter.status !== 'all' && task.status !== filter.status) return false;
          
          // Priority filter
          if (filter.priority !== 'all' && task.priority !== filter.priority) return false;
          
          // Category filter
          if (filter.category && task.category !== filter.category) return false;
          
          // Task type filter
          if (filter.taskType !== 'all' && task.taskType !== filter.taskType) return false;
          
          return true;
        });
        
        // Sort
        filtered.sort((a, b) => {
          switch (sortBy) {
            case 'newest':
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'oldest':
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'dueDate':
              if (!a.dueDate && !b.dueDate) return 0;
              if (!a.dueDate) return 1;
              if (!b.dueDate) return -1;
              return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            case 'priority':
              const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            case 'alphabetical':
              return a.title.localeCompare(b.title);
            default:
              return 0;
          }
        });
        
        return filtered;
      },

      getTaskStats: () => {
        const { tasks } = get();
        const total = tasks.length;
        const completed = tasks.filter((t) => t.status === 'completed').length;
        const pending = tasks.filter((t) => t.status === 'pending').length;
        const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
        const pinned = tasks.filter((t) => t.isPinned).length;
        const archived = tasks.filter((t) => t.isArchived).length;
        
        const overdue = tasks.filter((t) => {
          if (t.status === 'completed' || !t.dueDate) return false;
          return isPast(parseISO(t.dueDate)) && !isToday(parseISO(t.dueDate));
        }).length;
        
        const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        return {
          total,
          completed,
          pending,
          inProgress,
          overdue,
          pinned,
          archived,
          completionPercentage,
        };
      },

      getTasksByStatus: (status) => {
        return get().tasks.filter((task) => task.status === status);
      },

      getPinnedTasks: () => {
        return get().tasks.filter((task) => task.isPinned && !task.isArchived);
      },

      getOverdueTasks: () => {
        return get().tasks.filter((task) => {
          if (task.status === 'completed' || !task.dueDate) return false;
          return isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate));
        });
      },

      getUpcomingTasks: () => {
        return get().tasks
          .filter((task) => {
            if (task.status === 'completed' || !task.dueDate) return false;
            const due = parseISO(task.dueDate);
            return isToday(due) || isTomorrow(due);
          })
          .sort((a, b) => {
            if (!a.dueDate || !b.dueDate) return 0;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          })
          .slice(0, 5);
      },

      getRecentTasks: () => {
        return get().tasks
          .filter((task) => !task.isArchived)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
      },
    }),
    {
      name: 'flowtask-storage',
      version: 1,
    }
  )
);
