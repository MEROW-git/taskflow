import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListTodo, 
  CheckCircle2, 
  Clock, 
  Archive, 
  Pin,
  Settings,
  Plus,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/store/taskStore';
import { useSettingsStore } from '@/store/settingsStore';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const location = useLocation();
  const { openAddModal, getTaskStats, getPinnedTasks, getTasksByStatus } = useTaskStore();
  const { sidebarCollapsed, toggleSidebar } = useSettingsStore();
  const { t } = useI18n();
  const isDesktopCollapsed = sidebarCollapsed;
  
  const stats = getTaskStats();
  const pinnedCount = getPinnedTasks().length;
  const archivedCount = getTasksByStatus('archived').length;
  
  const mainNavItems: NavItem[] = [
    { path: '/', label: t('nav.dashboard'), icon: LayoutDashboard },
    { path: '/tasks', label: t('nav.allTasks'), icon: ListTodo, badge: stats.total },
    { path: '/pending', label: t('nav.pending'), icon: Clock, badge: stats.pending },
    { path: '/completed', label: t('nav.completed'), icon: CheckCircle2, badge: stats.completed },
    { path: '/pinned', label: t('nav.pinned'), icon: Pin, badge: pinnedCount },
    { path: '/archived', label: t('nav.archived'), icon: Archive, badge: archivedCount },
  ];
  
  const bottomNavItems: NavItem[] = [
    { path: '/settings', label: t('nav.settings'), icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50',
          'transition-all duration-300 ease-in-out',
          'w-64 lg:w-64',
          isDesktopCollapsed && 'lg:w-20',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          {!isDesktopCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                <ListTodo className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg text-gray-900 dark:text-white">
                FlowTask
              </span>
            </div>
          )}
          {isDesktopCollapsed && (
            <div className="hidden lg:flex w-8 h-8 rounded-lg bg-violet-600 items-center justify-center mx-auto">
              <ListTodo className="w-5 h-5 text-white" />
            </div>
          )}
          
          {/* Collapse button (desktop only) */}
          <button
            onClick={toggleSidebar}
            className={cn(
              'hidden lg:flex items-center justify-center w-6 h-6 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
              isDesktopCollapsed && 'absolute -right-3 top-5 w-6 h-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full'
            )}
          >
            {isDesktopCollapsed ? (
              <ChevronRight className="w-3 h-3 text-gray-500" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {/* Close button (mobile only) */}
          <button
            onClick={onToggle}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Add Task Button */}
        <div className="p-4">
          <Button
            onClick={openAddModal}
            className={cn(
              'w-full bg-violet-600 hover:bg-violet-700 text-white',
              isDesktopCollapsed && 'lg:p-2'
            )}
          >
            <Plus className="w-5 h-5" />
            <span className={cn('ml-2', isDesktopCollapsed && 'lg:hidden')}>{t('common.addTask')}</span>
          </Button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  onToggle();
                }
              }}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive(item.path)
                  ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                isDesktopCollapsed && 'lg:justify-center lg:px-2'
              )}
            >
              <item.icon className={cn(
                'w-5 h-5 flex-shrink-0',
                isActive(item.path) ? 'text-violet-600 dark:text-violet-400' : 'text-gray-500 dark:text-gray-400'
              )} />
              <div className={cn('flex items-center flex-1', isDesktopCollapsed && 'lg:hidden')}>
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={cn(
                      'px-2 py-0.5 text-xs rounded-full',
                      isActive(item.path)
                        ? 'bg-violet-200 dark:bg-violet-800 text-violet-800 dark:text-violet-200'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    )}>
                      {item.badge}
                    </span>
                  )}
                </>
              </div>
            </NavLink>
          ))}
        </nav>
        
        {/* Bottom Navigation */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-3">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  onToggle();
                }
              }}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive(item.path)
                  ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                isDesktopCollapsed && 'lg:justify-center lg:px-2'
              )}
            >
              <item.icon className={cn(
                'w-5 h-5 flex-shrink-0',
                isActive(item.path) ? 'text-violet-600 dark:text-violet-400' : 'text-gray-500 dark:text-gray-400'
              )} />
              <span className={cn(isDesktopCollapsed && 'lg:hidden')}>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  );
};
