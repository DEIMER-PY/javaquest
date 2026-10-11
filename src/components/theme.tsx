'use client';
import { createContext, useContext, useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/i18n';
import { Button } from './ui/button';
type Theme = 'light' | 'dark';
const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null);
function snapshot(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}
function serverSnapshot(): Theme {
  return 'dark';
}
function subscribe(notify: () => void) {
  const storage = (event: StorageEvent) => {
    if (event.key === 'javaquest-theme') {
      document.documentElement.classList.toggle('dark', event.newValue !== 'light');
      notify();
    }
  };
  window.addEventListener('javaquest-theme-change', notify);
  window.addEventListener('storage', storage);
  return () => {
    window.removeEventListener('javaquest-theme-change', notify);
    window.removeEventListener('storage', storage);
  };
}
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      localStorage.setItem('javaquest-theme', next);
    } catch {}
    window.dispatchEvent(new Event('javaquest-theme-change'));
  }
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}
export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw Error('ThemeProvider missing');
  return value;
}
export function ThemeToggle({ locale }: { locale: Locale }) {
  const { theme, toggle } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="theme-toggle"
      onClick={toggle}
      aria-label={
        theme === 'dark'
          ? t(locale, 'Activar modo claro', 'Switch to light mode')
          : t(locale, 'Activar modo oscuro', 'Switch to dark mode')
      }
    >
      {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
    </Button>
  );
}
