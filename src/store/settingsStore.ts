import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  // Appearance
  darkMode: boolean;
  sidebarCollapsed: boolean;

  // Profile
  userName: string;
  avatarUrl: string;
  hasCompletedOnboarding: boolean;
  
  // Notifications
  enableNotifications: boolean;
  dueDateReminders: boolean;
  reminderTime: number; // minutes before due date
  
  // Behavior
  confirmBeforeDelete: boolean;
  autoSave: boolean;
  
  // Actions
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (value: boolean) => void;
  setUserProfile: (profile: { userName: string; avatarUrl?: string }) => void;
  clearUserProfile: () => void;
  toggleNotifications: () => void;
  toggleDueDateReminders: () => void;
  setReminderTime: (minutes: number) => void;
  toggleConfirmBeforeDelete: () => void;
  toggleAutoSave: () => void;
  
  // Reset
  resetSettings: () => void;
}

const defaultSettings = {
  darkMode: false,
  sidebarCollapsed: false,
  userName: '',
  avatarUrl: '',
  hasCompletedOnboarding: false,
  enableNotifications: false,
  dueDateReminders: true,
  reminderTime: 60, // 1 hour before
  confirmBeforeDelete: true,
  autoSave: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      toggleDarkMode: () => {
        set((state) => {
          const newDarkMode = !state.darkMode;
          // Apply dark mode to document
          if (newDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { darkMode: newDarkMode };
        });
      },

      setDarkMode: (value) => {
        set(() => {
          if (value) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { darkMode: value };
        });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setSidebarCollapsed: (value) => {
        set({ sidebarCollapsed: value });
      },

      setUserProfile: ({ userName, avatarUrl = '' }) => {
        set({
          userName: userName.trim(),
          avatarUrl: avatarUrl.trim(),
          hasCompletedOnboarding: true,
        });
      },

      clearUserProfile: () => {
        set({
          userName: '',
          avatarUrl: '',
          hasCompletedOnboarding: false,
        });
      },

      toggleNotifications: () => {
        set((state) => ({ enableNotifications: !state.enableNotifications }));
      },

      toggleDueDateReminders: () => {
        set((state) => ({ dueDateReminders: !state.dueDateReminders }));
      },

      setReminderTime: (minutes) => {
        set({ reminderTime: minutes });
      },

      toggleConfirmBeforeDelete: () => {
        set((state) => ({ confirmBeforeDelete: !state.confirmBeforeDelete }));
      },

      toggleAutoSave: () => {
        set((state) => ({ autoSave: !state.autoSave }));
      },

      resetSettings: () => {
        set(defaultSettings);
        document.documentElement.classList.remove('dark');
      },
    }),
    {
      name: 'flowtask-settings',
      version: 1,
      onRehydrateStorage: () => (state) => {
        // Apply dark mode on rehydrate
        if (state?.darkMode) {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);
