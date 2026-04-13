import { v4 as uuidv4 } from 'uuid';
import type { Task } from '@/types/task';

export const sampleTasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Welcome to FlowTask! 🎉',
    description: 'This is a sample task to help you get started with FlowTask. Click on it to edit or explore the features.',
    taskType: 'basic',
    priority: 'medium',
    status: 'pending',
    dueDate: null,
    category: 'personal',
    checklist: [],
    isPinned: true,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
  },
  {
    id: uuidv4(),
    title: 'Complete project proposal',
    description: 'Write and finalize the Q4 project proposal document with budget estimates and timeline.',
    taskType: 'dueDate',
    priority: 'high',
    status: 'in-progress',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    category: 'work',
    checklist: [
      { id: uuidv4(), text: 'Research market trends', completed: true, createdAt: new Date().toISOString() },
      { id: uuidv4(), text: 'Draft proposal outline', completed: true, createdAt: new Date().toISOString() },
      { id: uuidv4(), text: 'Add budget section', completed: false, createdAt: new Date().toISOString() },
      { id: uuidv4(), text: 'Review with team', completed: false, createdAt: new Date().toISOString() },
    ],
    isPinned: false,
    isArchived: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
  },
  {
    id: uuidv4(),
    title: 'Grocery shopping',
    description: 'Buy groceries for the week',
    taskType: 'checklist',
    priority: 'low',
    status: 'pending',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    category: 'shopping',
    checklist: [
      { id: uuidv4(), text: 'Milk and eggs', completed: false, createdAt: new Date().toISOString() },
      { id: uuidv4(), text: 'Fresh vegetables', completed: false, createdAt: new Date().toISOString() },
      { id: uuidv4(), text: 'Bread and cereals', completed: false, createdAt: new Date().toISOString() },
      { id: uuidv4(), text: 'Coffee and tea', completed: false, createdAt: new Date().toISOString() },
      { id: uuidv4(), text: 'Fruits', completed: false, createdAt: new Date().toISOString() },
    ],
    isPinned: false,
    isArchived: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
  },
  {
    id: uuidv4(),
    title: 'Weekly team meeting',
    description: 'Recurring weekly sync with the development team to discuss progress and blockers.',
    taskType: 'recurring',
    priority: 'medium',
    status: 'pending',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'work',
    checklist: [],
    isPinned: false,
    isArchived: false,
    isRecurring: true,
    recurringPattern: 'weekly',
    recurringDays: [1], // Monday
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
  },
  {
    id: uuidv4(),
    title: 'Morning workout routine',
    description: 'Daily exercise routine to stay healthy and energized throughout the day.',
    taskType: 'recurring',
    priority: 'medium',
    status: 'completed',
    dueDate: new Date().toISOString(),
    category: 'health',
    checklist: [
      { id: uuidv4(), text: 'Stretching (5 min)', completed: true, createdAt: new Date().toISOString() },
      { id: uuidv4(), text: 'Cardio (20 min)', completed: true, createdAt: new Date().toISOString() },
      { id: uuidv4(), text: 'Strength training (15 min)', completed: true, createdAt: new Date().toISOString() },
      { id: uuidv4(), text: 'Cool down (5 min)', completed: true, createdAt: new Date().toISOString() },
    ],
    isPinned: true,
    isArchived: false,
    isRecurring: true,
    recurringPattern: 'daily',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Project ideas and notes',
    description: 'Collection of ideas for upcoming projects and feature enhancements.',
    taskType: 'note',
    priority: 'low',
    status: 'pending',
    dueDate: null,
    category: 'work',
    checklist: [],
    isPinned: false,
    isArchived: false,
    noteContent: `# Project Ideas

## Mobile App
- Offline support
- Push notifications
- Dark mode

## Web Dashboard
- Analytics integration
- Real-time updates
- Export functionality

## API Improvements
- Rate limiting
- Better error messages
- Webhook support`,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
  },
  {
    id: uuidv4(),
    title: 'Pay monthly bills',
    description: 'Pay electricity, internet, and phone bills before the due date.',
    taskType: 'dueDate',
    priority: 'urgent',
    status: 'pending',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'finance',
    checklist: [
      { id: uuidv4(), text: 'Electricity bill', completed: false, createdAt: new Date().toISOString() },
      { id: uuidv4(), text: 'Internet bill', completed: false, createdAt: new Date().toISOString() },
      { id: uuidv4(), text: 'Phone bill', completed: false, createdAt: new Date().toISOString() },
    ],
    isPinned: true,
    isArchived: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
  },
  {
    id: uuidv4(),
    title: 'Learn React hooks',
    description: 'Study advanced React hooks patterns and practice with examples.',
    taskType: 'checklist',
    priority: 'medium',
    status: 'in-progress',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'education',
    checklist: [
      { id: uuidv4(), text: 'useEffect deep dive', completed: true, createdAt: new Date().toISOString() },
      { id: uuidv4(), text: 'Custom hooks', completed: true, createdAt: new Date().toISOString() },
      { id: uuidv4(), text: 'useMemo and useCallback', completed: false, createdAt: new Date().toISOString() },
      { id: uuidv4(), text: 'useReducer patterns', completed: false, createdAt: new Date().toISOString() },
      { id: uuidv4(), text: 'Build a practice project', completed: false, createdAt: new Date().toISOString() },
    ],
    isPinned: false,
    isArchived: false,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
  },
];

export const initializeSampleTasks = () => {
  const stored = localStorage.getItem('flowtask-storage');
  if (!stored) {
    // No existing data, sample tasks will be loaded by the app
    return true;
  }
  return false;
};
