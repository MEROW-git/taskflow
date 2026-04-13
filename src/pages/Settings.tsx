import { useState, useRef } from 'react';
import { 
  Moon, 
  Sun, 
  Bell, 
  Download, 
  Upload, 
  Trash2, 
  Info,
  Github,
  Shield,
  Save
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useSettingsStore } from '@/store/settingsStore';
import { useTaskStore } from '@/store/taskStore';
import { toast } from '@/components/ui-custom/ToastContainer';

export const Settings = () => {
  const {
    darkMode,
    toggleDarkMode,
    enableNotifications,
    toggleNotifications,
    dueDateReminders,
    toggleDueDateReminders,
    confirmBeforeDelete,
    toggleConfirmBeforeDelete,
  } = useSettingsStore();

  const { exportTasks, importTasks, clearAll, tasks } = useTaskStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleExport = () => {
    const data = exportTasks();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowtask-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Tasks exported successfully');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const result = importTasks(content);
        if (result.success) {
          toast.success(result.message);
          setImportError(null);
        } else {
          setImportError(result.message);
          toast.error(result.message);
        }
      } catch (error) {
        setImportError('Failed to read file');
        toast.error('Failed to read file');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete ALL tasks? This cannot be undone.')) {
      clearAll();
      toast.success('All tasks deleted');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Customize your FlowTask experience
        </p>
      </div>

      {/* Appearance */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          {darkMode ? (
            <Moon className="w-5 h-5 text-violet-600" />
          ) : (
            <Sun className="w-5 h-5 text-amber-500" />
          )}
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Appearance
          </h2>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="dark-mode" className="font-medium">
              Dark Mode
            </Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Switch between light and dark themes
            </p>
          </div>
          <Switch
            id="dark-mode"
            checked={darkMode}
            onCheckedChange={toggleDarkMode}
          />
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
          </h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications" className="font-medium">
                Enable Notifications
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive browser notifications for task updates
              </p>
            </div>
            <Switch
              id="notifications"
              checked={enableNotifications}
              onCheckedChange={toggleNotifications}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="due-reminders" className="font-medium">
                Due Date Reminders
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Get reminded before tasks are due
              </p>
            </div>
            <Switch
              id="due-reminders"
              checked={dueDateReminders}
              onCheckedChange={toggleDueDateReminders}
            />
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Save className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Data Management
          </h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Export Tasks</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Download all your tasks as a JSON file
              </p>
            </div>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Import Tasks</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Import tasks from a JSON file
              </p>
            </div>
            <Button variant="outline" onClick={handleImportClick}>
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          
          {importError && (
            <p className="text-sm text-red-600">{importError}</p>
          )}
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium text-red-600">Clear All Data</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Delete all tasks permanently ({tasks.length} tasks)
              </p>
            </div>
            <Button variant="destructive" onClick={handleClearAll}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>
      </Card>

      {/* Behavior */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Behavior
          </h2>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="confirm-delete" className="font-medium">
              Confirm Before Delete
            </Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Show confirmation dialog before deleting tasks
            </p>
          </div>
          <Switch
            id="confirm-delete"
            checked={confirmBeforeDelete}
            onCheckedChange={toggleConfirmBeforeDelete}
          />
        </div>
      </Card>

      {/* About */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            About
          </h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center">
              <span className="text-xl font-bold text-white">F</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                FlowTask
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Version 1.0.0
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Built by:</span> Meas Puttivireak
            </p>
            <a
              href="https://github.com/MEROW-git"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700 transition-colors"
            >
              <Github className="w-4 h-4" />
              github.com/MEROW-git
            </a>
          </div>
          
          <Separator />
          
          <p className="text-xs text-gray-500 dark:text-gray-400">
            FlowTask stores all data locally in your browser. No data is sent to any server.
          </p>
        </div>
      </Card>
    </div>
  );
};
