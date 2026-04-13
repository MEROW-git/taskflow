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
  Save,
  User,
  Trash2 as RemoveIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSettingsStore } from '@/store/settingsStore';
import { useTaskStore } from '@/store/taskStore';
import { toast } from '@/components/ui-custom/ToastContainer';
import { requestNotificationPermission, sendBrowserNotification, isNotificationSupported } from '@/utils/notificationUtils';
import { useI18n } from '@/lib/i18n';

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
    userName,
    avatarUrl,
    language,
    setLanguage,
    setUserProfile,
  } = useSettingsStore();
  const { t } = useI18n();

  const { exportTasks, importTasks, clearAll, tasks } = useTaskStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [profileName, setProfileName] = useState(userName);
  const [profileAvatarUrl, setProfileAvatarUrl] = useState(avatarUrl);

  const profileInitials =
    profileName
      .trim()
      .split(/\s+/)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')
      .slice(0, 2) || 'U';

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
    toast.success(t('settings.exportTasks'));
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
      } catch {
        setImportError('Failed to read file');
        toast.error('Failed to read file');
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearAll = () => {
    if (window.confirm(t('tasksPage.confirmDeleteMany', { count: tasks.length }))) {
      clearAll();
      toast.success(t('settings.allTasksDeleted'));
    }
  };

  const handleSaveProfile = () => {
    if (!profileName.trim()) {
      toast.error(t('settings.nameRequired'));
      return;
    }

    setUserProfile({
      userName: profileName,
      avatarUrl: profileAvatarUrl,
    });
    toast.success(t('settings.profileUpdated'));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        setProfileAvatarUrl(result);
      }
    };
    reader.readAsDataURL(file);

    e.target.value = '';
  };

  const handleToggleNotifications = async (checked: boolean) => {
    if (checked) {
      if (!isNotificationSupported()) {
        toast.error(t('navbar.browserNotSupported'));
        return;
      }

      const permission = await requestNotificationPermission();
      if (permission !== 'granted') {
        toast.error(t('navbar.permissionNotGranted'));
        return;
      }

      if (!enableNotifications) {
        toggleNotifications();
      }

      sendBrowserNotification(t('settings.notificationsEnabledTitle'), {
        body: t('settings.notificationsEnabledBody'),
      });
      toast.success(t('settings.notificationsEnabled'));
      return;
    }

    if (enableNotifications) {
      toggleNotifications();
    }
    toast.info(t('settings.notificationsDisabled'));
  };

  const handleToggleDueReminders = (checked: boolean) => {
    if (!enableNotifications && checked) {
      toast.error(t('settings.enableNotificationsBeforeReminders'));
      return;
    }

    if (dueDateReminders !== checked) {
      toggleDueDateReminders();
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('settings.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {t('settings.subtitle')}
        </p>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <User className="w-5 h-5 text-violet-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('settings.profile')}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
            <Avatar className="h-14 w-14">
              <AvatarImage src={profileAvatarUrl} alt={profileName || 'User profile'} />
              <AvatarFallback className="bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                {profileInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {profileName.trim() || 'Unnamed user'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('settings.storedLocally')}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('settings.language')}</Label>
            <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'km')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t('settings.english')}</SelectItem>
                <SelectItem value="km">{t('settings.khmer')}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('settings.languageDescription')}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-name">{t('settings.name')}</Label>
            <Input
              id="profile-name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder={t('welcome.enterYourName')}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('settings.profileImage')}</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => avatarInputRef.current?.click()}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                {profileAvatarUrl ? t('settings.changeImage') : t('settings.uploadImage')}
              </Button>
              {profileAvatarUrl && (
                <Button type="button" variant="outline" onClick={() => setProfileAvatarUrl('')}>
                  <RemoveIcon className="w-4 h-4" />
                </Button>
              )}
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('settings.storedLocally')}
            </p>
          </div>

          <Button onClick={handleSaveProfile} className="bg-violet-600 hover:bg-violet-700">
            {t('settings.saveProfile')}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-3">
          {darkMode ? (
            <Moon className="w-5 h-5 text-violet-600" />
          ) : (
            <Sun className="w-5 h-5 text-amber-500" />
          )}
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('settings.appearance')}
          </h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="dark-mode" className="font-medium">
              {t('settings.darkMode')}
            </Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('settings.darkModeDescription')}
            </p>
          </div>
          <Switch id="dark-mode" checked={darkMode} onCheckedChange={toggleDarkMode} />
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <Bell className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('settings.notifications')}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications" className="font-medium">
                {t('settings.enableNotifications')}
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('settings.notificationsDescription')}
              </p>
            </div>
            <Switch
              id="notifications"
              checked={enableNotifications}
              onCheckedChange={handleToggleNotifications}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="due-reminders" className="font-medium">
                {t('settings.dueDateReminders')}
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('settings.dueDateRemindersDescription')}
              </p>
            </div>
            <Switch
              id="due-reminders"
              checked={dueDateReminders}
              onCheckedChange={handleToggleDueReminders}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <Save className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('settings.dataManagement')}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">{t('settings.exportTasks')}</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('settings.exportDescription')}
              </p>
            </div>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              {t('settings.exportTasks')}
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">{t('settings.importTasks')}</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('settings.importDescription')}
              </p>
            </div>
            <Button variant="outline" onClick={handleImportClick}>
              <Upload className="w-4 h-4 mr-2" />
              {t('settings.importTasks')}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {importError && <p className="text-sm text-red-600">{importError}</p>}

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium text-red-600">{t('settings.clearAllData')}</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('settings.clearAllDescription', { count: tasks.length })}
              </p>
            </div>
            <Button variant="destructive" onClick={handleClearAll}>
              <Trash2 className="w-4 h-4 mr-2" />
              {t('tasksPage.clearAll')}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <Shield className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('settings.behavior')}
          </h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="confirm-delete" className="font-medium">
              {t('settings.confirmBeforeDelete')}
            </Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('settings.confirmDeleteDescription')}
            </p>
          </div>
          <Switch
            id="confirm-delete"
            checked={confirmBeforeDelete}
            onCheckedChange={toggleConfirmBeforeDelete}
          />
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <Info className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('settings.about')}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600">
              <span className="text-xl font-bold text-white">F</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">FlowTask</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Version 1.0.0</p>
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
            {t('settings.localOnly')}
          </p>
        </div>
      </Card>
    </div>
  );
};
