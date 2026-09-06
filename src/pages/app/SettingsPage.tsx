import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Bell, Lock, Sparkles, LogOut, ChevronRight } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { useAuth } from '@/contexts/AuthContext';

interface NotificationSettings {
  morningRitual: boolean;
  eveningAbhyanga: boolean;
  seasonalTransitions: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  morningRitual: true,
  eveningAbhyanga: true,
  seasonalTransitions: true,
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const [notifications, setNotifications] = useState<NotificationSettings>(() => {
    try {
      const raw = localStorage.getItem('aayurface_notification_settings');
      return raw ? (JSON.parse(raw) as NotificationSettings) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  const updateNotification = (key: keyof NotificationSettings, val: boolean) => {
    setNotifications((prev: NotificationSettings) => {
      const next: NotificationSettings = { ...prev, [key]: val };
      try {
        localStorage.setItem('aayurface_notification_settings', JSON.stringify(next));
      } catch {
        // Ignore storage error
      }
      return next;
    });
  };

  const handleLogout = async () => {
    await signOut();
    window.location.replace('/');
  };

  return (
    <PageWrapper>
      <div className="space-y-8 max-w-4xl mx-auto w-full pb-16 font-body">
        
        {/* Header */}
        <div className="space-y-2 pb-5 border-b border-border-default">
          <div className="flex items-center gap-2">
            <span className="text-caption font-body font-semibold uppercase tracking-wider text-brand-accent">
              Preferences & Account
            </span>
            <span className="text-border-default">•</span>
            <span className="text-caption text-text-tertiary">System Settings</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary">
            Settings
          </h1>
          <p className="text-body-md text-text-secondary max-w-2xl">
            Configure your daily ritual reminders, privacy preferences, and account controls.
          </p>
        </div>

        {/* Informative Presentation State Banner */}
        <div className="p-4 rounded-md bg-background-subtle border border-border-default flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
          <div className="text-caption text-text-secondary space-y-0.5">
            <p className="font-semibold text-text-primary">Presentation Mode — Local Preferences</p>
            <p>
              Settings are stored locally in your browser session. AayurFace operates as a private, client-side digital wellness companion.
            </p>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          
          {/* Notifications */}
          <div className="p-6 rounded-lg bg-background-surface border border-border-default shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-border-default/60">
              <Bell className="w-5 h-5 text-brand-primary" />
              <div>
                <h2 className="font-display text-xl font-semibold text-text-primary">
                  Ritual & Dinacharya Reminders
                </h2>
                <p className="text-caption text-text-tertiary">
                  Gentle prompts to keep your daily Ayurvedic rhythms aligned
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-body-md font-medium text-text-primary">Morning Pratah Kal Reminder</p>
                  <p className="text-caption text-text-secondary">Notification at 6:30 AM for warm water & facial splash</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.morningRitual}
                  onChange={(e) => updateNotification('morningRitual', e.target.checked)}
                  className="w-5 h-5 accent-brand-primary rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-body-md font-medium text-text-primary">Evening Abhyanga & Rest Reminder</p>
                  <p className="text-caption text-text-secondary">Notification at 9:30 PM for Kumkumadi oil routine</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.eveningAbhyanga}
                  onChange={(e) => updateNotification('eveningAbhyanga', e.target.checked)}
                  className="w-5 h-5 accent-brand-primary rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-body-md font-medium text-text-primary">Seasonal Ritu Sandhi Transitions</p>
                  <p className="text-caption text-text-secondary">Reminders during junction periods between Ayurvedic seasons</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.seasonalTransitions}
                  onChange={(e) => updateNotification('seasonalTransitions', e.target.checked)}
                  className="w-5 h-5 accent-brand-primary rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Privacy & Wellness Transparency */}
          <div className="p-6 rounded-lg bg-background-surface border border-border-default shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border-default/60">
              <Shield className="w-5 h-5 text-brand-primary" />
              <div>
                <h2 className="font-display text-xl font-semibold text-text-primary">
                  Privacy & Data Transparency
                </h2>
                <p className="text-caption text-text-tertiary">
                  How your facial observations and wellness notes are handled
                </p>
              </div>
            </div>

            <div className="space-y-3 text-body-md text-text-secondary leading-relaxed">
              <div className="p-3.5 rounded-md bg-background-primary/60 border border-border-default/60 space-y-1">
                <p className="font-semibold text-text-primary text-caption uppercase tracking-wider">
                  Client-Side Capture & Non-Diagnostic Framing
                </p>
                <p className="text-caption text-text-secondary">
                  AayurFace provides educational and observational Ayurvedic wellness reflections. Camera feeds are processed locally within your browser session. No medical diagnoses are provided or implied.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-caption text-text-tertiary">Session ID & Auth State</span>
                <span className="text-caption font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Local Browser Encrypted
                </span>
              </div>
            </div>
          </div>

          {/* Account Controls */}
          <div className="p-6 rounded-lg bg-background-surface border border-border-default shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border-default/60">
              <Lock className="w-5 h-5 text-brand-primary" />
              <div>
                <h2 className="font-display text-xl font-semibold text-text-primary">
                  Account Management
                </h2>
                <p className="text-caption text-text-tertiary">
                  Manage your profile information and active session
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={() => navigate('/profile/edit')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-border-default bg-background-surface text-text-primary text-body-md font-medium hover:bg-background-subtle transition-colors cursor-pointer"
              >
                Edit Profile Details
                <ChevronRight className="w-4 h-4 text-text-tertiary" />
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-red-200 text-red-700 bg-red-50/50 text-body-md font-medium hover:bg-red-50 hover:text-red-800 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

        </div>

      </div>
    </PageWrapper>
  );
}
