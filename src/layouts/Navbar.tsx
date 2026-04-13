import { Menu, Search, Bell, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTaskStore } from '@/store/taskStore';
import { useSettingsStore } from '@/store/settingsStore';
import { toast } from '@/components/ui-custom/ToastContainer';
import { requestNotificationPermission, sendBrowserNotification, isNotificationSupported } from '@/utils/notificationUtils';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { filter, setFilter } = useTaskStore();
  const { darkMode, toggleDarkMode, userName, avatarUrl, enableNotifications } = useSettingsStore();
  const userInitial =
    userName
      .trim()
      .split(/\s+/)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')
      .slice(0, 2) || 'U';

  const handleNotificationClick = async () => {
    if (!isNotificationSupported()) {
      toast.error('This browser does not support notifications');
      return;
    }

    if (!enableNotifications) {
      toast.info('Enable notifications in Settings first');
      return;
    }

    if (Notification.permission !== 'granted') {
      const permission = await requestNotificationPermission();
      if (permission !== 'granted') {
        toast.error('Notification permission was not granted');
        return;
      }
    }

    sendBrowserNotification('FlowTask test notification', {
      body: 'Notifications are working in this browser.',
    });
    toast.success('Test notification sent');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Button>
          
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={filter.searchQuery}
              onChange={(e) => setFilter({ searchQuery: e.target.value })}
              className="pl-9 w-64 bg-gray-100 dark:bg-gray-800 border-0 focus-visible:ring-violet-500"
            />
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => {
              const searchInput = document.getElementById('mobile-search');
              searchInput?.focus();
            }}
          >
            <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Button>
          
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="text-gray-600 dark:text-gray-400"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
          
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNotificationClick}
            className="text-gray-600 dark:text-gray-400 relative"
            title="Send test notification"
          >
            <Bell className="w-5 h-5" />
            {enableNotifications && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-violet-600 rounded-full" />
            )}
          </Button>
          
          {/* User Avatar */}
          <Avatar className="h-8 w-8 ring-2 ring-violet-100 dark:ring-violet-900/60">
            <AvatarImage src={avatarUrl} alt={userName || 'User profile'} />
            <AvatarFallback className="bg-violet-100 text-sm font-medium text-violet-700 dark:bg-violet-900 dark:text-violet-300">
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      {/* Mobile Search Input */}
      <div className="sm:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="mobile-search"
            type="text"
            placeholder="Search tasks..."
            value={filter.searchQuery}
            onChange={(e) => setFilter({ searchQuery: e.target.value })}
            className="pl-9 w-full bg-gray-100 dark:bg-gray-800 border-0 focus-visible:ring-violet-500"
          />
        </div>
      </div>
    </header>
  );
};
