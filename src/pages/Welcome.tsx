import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ListTodo, Sparkles, ArrowRight, Upload, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSettingsStore } from '@/store/settingsStore';
import { useTaskStore } from '@/store/taskStore';
import { useI18n } from '@/lib/i18n';

const LEGACY_SAMPLE_TITLES = new Set([
  'Welcome to FlowTask! ðŸŽ‰',
  'Complete project proposal',
  'Grocery shopping',
  'Weekly team meeting',
  'Morning workout routine',
  'Project ideas and notes',
  'Pay monthly bills',
  'Learn React hooks',
]);

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'U';

export const Welcome = () => {
  const navigate = useNavigate();
  const { hasCompletedOnboarding, setUserProfile } = useSettingsStore();
  const { tasks, clearAll } = useTaskStore();
  const { t } = useI18n();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [userName, setUserName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (hasCompletedOnboarding || tasks.length === 0) return;

    const onlyLegacySamples = tasks.every((task) => LEGACY_SAMPLE_TITLES.has(task.title));
    if (onlyLegacySamples) {
      clearAll();
    }
  }, [clearAll, hasCompletedOnboarding, tasks]);

  if (hasCompletedOnboarding) {
    return <Navigate to="/" replace />;
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        setAvatarUrl(result);
      }
    };
    reader.readAsDataURL(file);

    e.target.value = '';
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    setUserProfile({
      userName,
      avatarUrl,
    });

    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.16),_transparent_38%),linear-gradient(180deg,#f8f7ff_0%,#ffffff_52%,#eef4ff_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.22),_transparent_35%),linear-gradient(180deg,#111827_0%,#09090b_100%)] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-violet-200/70 bg-white/70 px-4 py-2 text-sm text-violet-700 shadow-sm backdrop-blur dark:border-violet-800 dark:bg-gray-900/60 dark:text-violet-300">
              <Sparkles className="h-4 w-4" />
              {t('welcome.browserOnly')}
            </div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-500/20">
                <ListTodo className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-950 dark:text-white sm:text-5xl">
                  {t('welcome.title')}
                </h1>
                <p className="mt-2 max-w-xl text-base text-gray-600 dark:text-gray-300 sm:text-lg">
                  {t('welcome.subtitle')}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-white/60 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/70">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{t('welcome.noDatabase')}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t('welcome.noDatabaseDesc')}</p>
              </Card>
              <Card className="border-white/60 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/70">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{t('welcome.noSignup')}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t('welcome.noSignupDesc')}</p>
              </Card>
              <Card className="border-white/60 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/70">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{t('welcome.privateByDefault')}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t('welcome.privateByDefaultDesc')}</p>
              </Card>
            </div>
          </div>

          <Card className="border-white/60 bg-white/85 p-6 shadow-xl shadow-violet-900/10 backdrop-blur dark:border-gray-800 dark:bg-gray-900/85 sm:p-8">
            <form onSubmit={handleContinue} className="space-y-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
                  {t('welcome.firstRun')}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                  {t('welcome.whoUsing')}
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {t('welcome.profileOptional')}
                </p>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-violet-50 p-4 dark:bg-violet-950/30">
                <Avatar className="h-16 w-16 ring-4 ring-white dark:ring-gray-900">
                  <AvatarImage src={avatarUrl} alt={userName || 'User profile'} />
                  <AvatarFallback className="bg-violet-600 text-lg font-semibold text-white">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {userName.trim() || t('welcome.preview')}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('welcome.staysInBrowser')}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-name">{t('welcome.yourName')}</Label>
                <Input
                  id="user-name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder={t('welcome.enterYourName')}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  {t('welcome.profileImageOptional')}
                </Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => avatarInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {avatarUrl ? t('settings.changeImage') : t('welcome.uploadImage')}
                  </Button>
                  {avatarUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAvatarUrl('')}
                    >
                      <Trash2 className="h-4 w-4" />
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
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  JPG, PNG, GIF, or WebP. {t('welcome.staysInBrowser')}
                </p>
              </div>

              <Button
                type="submit"
                disabled={!userName.trim()}
                className="w-full bg-violet-600 hover:bg-violet-700"
              >
                {t('welcome.continueDashboard')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
