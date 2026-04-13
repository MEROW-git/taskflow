import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

// Global toast state
let toasts: Toast[] = [];
let listeners: ((toasts: Toast[]) => void)[] = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener([...toasts]));
};

export const toast = {
  success: (message: string, duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    toasts = [...toasts, { id, message, type: 'success', duration }];
    notifyListeners();
    setTimeout(() => toast.dismiss(id), duration);
    return id;
  },
  error: (message: string, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    toasts = [...toasts, { id, message, type: 'error', duration }];
    notifyListeners();
    setTimeout(() => toast.dismiss(id), duration);
    return id;
  },
  warning: (message: string, duration = 3500) => {
    const id = Math.random().toString(36).substring(2, 9);
    toasts = [...toasts, { id, message, type: 'warning', duration }];
    notifyListeners();
    setTimeout(() => toast.dismiss(id), duration);
    return id;
  },
  info: (message: string, duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    toasts = [...toasts, { id, message, type: 'info', duration }];
    notifyListeners();
    setTimeout(() => toast.dismiss(id), duration);
    return id;
  },
  dismiss: (id: string) => {
    toasts = toasts.filter(t => t.id !== id);
    notifyListeners();
  }
};

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastStyles = {
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
  warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
};

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500',
};

export const ToastContainer = () => {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => setCurrentToasts(newToasts);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  if (currentToasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {currentToasts.map((t) => {
        const Icon = toastIcons[t.type];
        return (
          <div
            key={t.id}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] max-w-[400px]',
              'animate-in slide-in-from-right-full fade-in duration-300',
              toastStyles[t.type]
            )}
          >
            <Icon className={cn('w-5 h-5 flex-shrink-0', iconColors[t.type])} />
            <p className="flex-1 text-sm font-medium">{t.message}</p>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
