'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n';
import type { Completion } from '@/lib/progress';
export type ProgressData = {
  completions: Completion[];
  activity: string[];
  projectSteps: { project_id: string; step: number }[];
  profile: { display_name: string; timezone: string; locale: Locale } | null;
};
const empty: ProgressData = { completions: [], activity: [], projectSteps: [], profile: null };
type Context = {
  locale: Locale;
  user: { id: string; name: string } | null;
  configured: boolean;
  progress: ProgressData;
  refresh: () => Promise<void>;
  recordLocal: (id: string) => void;
  notice: string;
  setNotice: (message: string) => void;
};
const LearningContext = createContext<Context | null>(null);
export function LearningProvider({
  locale,
  user,
  configured,
  children,
}: {
  locale: Locale;
  user: Context['user'];
  configured: boolean;
  children: React.ReactNode;
}) {
  const [progress, setProgress] = useState(empty);
  const [notice, setNotice] = useState('');
  const refresh = useCallback(async () => {
    if (!user) {
      try {
        const stored = JSON.parse(localStorage.getItem('javaquest-progress-v1') ?? 'null');
        if (stored && Array.isArray(stored.completions) && Array.isArray(stored.activity))
          setProgress({ ...empty, ...stored });
      } catch {
        /* Ignore invalid local data. */
      }
      return;
    }
    try {
      const response = await fetch('/api/progress', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      setProgress(data);
    } catch {
      setNotice(
        locale === 'es'
          ? 'No se pudo sincronizar el progreso. Intenta de nuevo.'
          : 'Progress could not sync. Please retry.',
      );
    }
  }, [user, locale]);
  useEffect(() => {
    document.documentElement.lang = locale;
    void Promise.resolve().then(refresh);
  }, [refresh, locale]);
  function recordLocal(id: string) {
    setProgress((current) => {
      const next = {
        ...current,
        completions: current.completions.some((c) => c.lesson_id === id)
          ? current.completions
          : [
              ...current.completions,
              { lesson_id: id, completed_at: new Date().toISOString(), xp: 25 },
            ],
      };
      // Guest practice is local only: it does not claim an authenticated daily streak.
      try {
        localStorage.setItem('javaquest-progress-v1', JSON.stringify(next));
      } catch {
        /* Storage can be unavailable. */
      }
      return next;
    });
  }
  return (
    <LearningContext.Provider
      value={{ locale, user, configured, progress, refresh, recordLocal, notice, setNotice }}
    >
      {children}
    </LearningContext.Provider>
  );
}
export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) throw Error('LearningProvider missing');
  return context;
}
