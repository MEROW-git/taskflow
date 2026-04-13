# FlowTask

A modern, clean, and fully-featured task management application that works entirely in your browser. No backend, no API, no database - all your data stays local and private.

![FlowTask Screenshot](https://via.placeholder.com/800x400/7B61FF/FFFFFF?text=FlowTask)

## Features

### Core Task Management
- **Create Tasks** - Add tasks with title, description, due date, priority, and category
- **Task Types** - Support for Basic, Checklist, Due Date, Recurring, Pinned, and Note tasks
- **Edit Tasks** - Full editing capabilities for all task properties
- **Delete Tasks** - Single or bulk delete with confirmation
- **Complete Tasks** - Mark tasks as complete/incomplete with one click

### Organization & Filtering
- **Categories** - Organize tasks by Personal, Work, Shopping, Health, Education, Finance
- **Priorities** - Set priority levels: Low, Medium, High, Urgent
- **Status Tracking** - Pending, In Progress, Completed, Archived
- **Search** - Find tasks by title, description, or category
- **Filter** - Filter by status, priority, category, and task type
- **Sort** - Sort by newest, oldest, due date, priority, or alphabetically

### Advanced Features
- **Checklist Tasks** - Add subtasks with progress tracking
- **Recurring Tasks** - Set up daily, weekly, or monthly recurring tasks
- **Note Tasks** - Store notes and ideas
- **Pinning** - Pin important tasks for quick access
- **Archiving** - Archive completed tasks without deleting them
- **Bulk Actions** - Select multiple tasks for batch operations

### Dashboard
- **Statistics Cards** - View total, completed, pending, overdue, and pinned tasks
- **Progress Bar** - Visual completion percentage
- **Recent Tasks** - Quick view of recently created tasks
- **Upcoming Due Dates** - See what's due soon
- **Overdue Alerts** - Warning banner for overdue tasks

### Data Management
- **Export** - Backup all tasks to JSON file
- **Import** - Restore tasks from JSON file
- **Local Storage** - All data saved in browser storage
- **No Account Required** - Start using immediately

### User Experience
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Toast Notifications** - Feedback for all actions
- **Confirmation Dialogs** - Prevent accidental deletions
- **Empty States** - Helpful guidance when no tasks exist
- **Sample Tasks** - Pre-loaded examples on first use

### PWA Support
- **Installable** - Add to home screen on mobile
- **Offline Ready** - Basic offline functionality
- **App-like Experience** - Full-screen mode on mobile

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand with persistence
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Project Structure

```
src/
├── components/
│   └── ui-custom/        # Custom UI components
│       ├── TaskCard.tsx
│       ├── TaskModal.tsx
│       ├── StatsCard.tsx
│       ├── FilterBar.tsx
│       ├── EmptyState.tsx
│       └── ToastContainer.tsx
├── layouts/
│   ├── MainLayout.tsx    # App shell with sidebar/navbar
│   ├── Sidebar.tsx
│   └── Navbar.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── AllTasks.tsx
│   ├── PendingTasks.tsx
│   ├── CompletedTasks.tsx
│   ├── ArchivedTasks.tsx
│   ├── PinnedTasks.tsx
│   └── Settings.tsx
├── store/
│   ├── taskStore.ts      # Task state management
│   └── settingsStore.ts  # App settings
├── types/
│   └── task.ts           # TypeScript interfaces
├── utils/
│   └── dateUtils.ts      # Date formatting utilities
├── data/
│   └── sampleTasks.ts    # Starter tasks
├── App.tsx
├── main.tsx
└── index.css
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MEROW-git/flowtask.git
cd flowtask
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## How Local Storage Works

FlowTask uses the browser's `localStorage` to persist all data:

- **Task Data**: Stored under the key `flowtask-storage`
- **Settings**: Stored under the key `flowtask-settings`
- **Automatic Saving**: All changes are saved automatically
- **Data Privacy**: Your data never leaves your device

### Data Structure

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  taskType: 'basic' | 'checklist' | 'dueDate' | 'recurring' | 'pinned' | 'note';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'archived';
  dueDate: string | null;
  category: string;
  checklist: ChecklistItem[];
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Deployment

### Static Hosting

Since FlowTask is a pure frontend application, it can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop the `dist/` folder
- **GitHub Pages**: Push to `gh-pages` branch
- **Firebase Hosting**: `firebase deploy`
- **AWS S3**: Upload `dist/` contents to S3 bucket

### Docker (Optional)

```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
EXPOSE 80
```

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | Add new task |
| `Ctrl/Cmd + K` | Focus search |
| `Esc` | Close modal |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Icons by [Lucide](https://lucide.dev/)
- Inspired by modern productivity apps

## Contact

**Meas Puttivireak**
- GitHub: [@MEROW-git](https://github.com/MEROW-git)

---

**FlowTask** - Work moves faster when it flows.
