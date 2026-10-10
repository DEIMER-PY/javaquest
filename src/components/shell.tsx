'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  Code2,
  FolderCode,
  GraduationCap,
  Home,
  Languages,
  LogOut,
  Menu,
  Moon,
  Rocket,
  Settings2,
  Flame,
  Sparkles,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLearning } from './providers';
import { labels, t } from '@/lib/i18n';
import { dayKey, streak } from '@/lib/progress';
import { browserClient } from '@/lib/supabase/client';
const items = [
  ['', Home, 'home'],
  ['/learn', BookOpen, 'learn'],
  ['/playground', Code2, 'playground'],
  ['/projects', FolderCode, 'projects'],
  ['/resources', GraduationCap, 'resources'],
  ['/profile', Settings2, 'profile'],
] as const;
export function Shell({ children }: { children: React.ReactNode }) {
  const { locale, user, progress, notice, setNotice } = useLearning();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const l = labels[locale];
  const xp = progress.completions.reduce((sum, c) => sum + c.xp, 0);
  const days = streak(
    progress.activity,
    dayKey(new Date(), progress.profile?.timezone ?? 'America/Bogota'),
  );
  async function logout() {
    await browserClient().auth.signOut();
    router.refresh();
  }
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        {t(locale, 'Saltar al contenido', 'Skip to content')}
      </a>
      {open ? (
        <button
          className="sidebar-backdrop"
          aria-label={t(locale, 'Cerrar menú', 'Close menu')}
          onClick={() => setOpen(false)}
        />
      ) : null}
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <Link href={`/${locale}`} className="brand">
          <span className="brand-icon">
            <Code2 size={24} />
          </span>
          java<span>quest</span>
          <span className="brand-dot">.</span>
        </Link>
        <button
          className="mobile-close"
          onClick={() => setOpen(false)}
          aria-label={t(locale, 'Cerrar menú', 'Close menu')}
        >
          <X />
        </button>
        <div className="sidebar-caption">
          {t(locale, 'TU ESPACIO PARA CRECER', 'YOUR SPACE TO GROW')}
        </div>
        <nav aria-label={t(locale, 'Navegación principal', 'Main navigation')}>
          {items.map(([path, Icon, key]) => {
            const href = `/${locale}${path}`;
            const active = path ? pathname.startsWith(href) : pathname === href;
            return (
              <Link
                key={key}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={`nav-item ${active ? 'active' : ''}`}
              >
                <Icon size={20} />
                {l[key]}
                {key === 'playground' ? <span className="nav-tag">JAVA</span> : null}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <Rocket size={23} />
            <strong>{t(locale, 'Un paso cada día.', 'One step every day.')}</strong>
            <p>
              {t(
                locale,
                'Los grandes proyectos comienzan con pequeñas líneas de código.',
                'Great projects begin with small lines of code.',
              )}
            </p>
          </div>
          <a
            className="source-link"
            href="https://github.com/DEIMER-PY/javaquest"
            target="_blank"
            rel="noreferrer"
          >
            {t(locale, 'Hecho para aprender juntos', 'Made to learn together')} ↗
          </a>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <Button
              variant="ghost"
              size="icon"
              className="mobile-menu"
              onClick={() => setOpen(true)}
              aria-label={t(locale, 'Abrir menú', 'Open menu')}
            >
              <Menu size={21} />
            </Button>
            <span className="breadcrumb">
              {t(locale, 'Aprende. Practica. Construye.', 'Learn. Practice. Build.')}
            </span>
          </div>
          <div className="topbar-actions">
            <span className="stat-pill flame">
              <Flame size={18} />
              {days}
              <span className="stat-label">{t(locale, 'días', 'days')}</span>
            </span>
            <span className="stat-pill xp">
              <Sparkles size={17} />
              {xp} XP
            </span>
            <Link
              className="language-button"
              href={pathname.replace(/^\/(es|en)/, locale === 'es' ? '/en' : '/es')}
              aria-label={l.language}
            >
              <Languages size={17} />
              {locale.toUpperCase()}
            </Link>
            <Button
              size="icon"
              variant="ghost"
              aria-label={l.theme}
              onClick={() => {
                const dark = document.documentElement.classList.toggle('dark');
                try {
                  localStorage.setItem('javaquest-theme', dark ? 'dark' : 'light');
                } catch {}
              }}
            >
              <Moon size={18} />
            </Button>
            {user ? (
              <>
                <Link className="avatar" href={`/${locale}/profile`} aria-label={l.profile}>
                  {(progress.profile?.display_name ?? user.name).slice(0, 1).toUpperCase()}
                </Link>
                <Button size="icon" variant="ghost" aria-label={l.logout} onClick={logout}>
                  <LogOut size={18} />
                </Button>
              </>
            ) : (
              <Button asChild size="sm" variant="outline">
                <Link href={`/${locale}/login`}>{l.login}</Link>
              </Button>
            )}
          </div>
        </header>
        <main id="main-content" className="page-content">
          {notice ? (
            <div role="status" className="notice">
              {notice}
              <button
                onClick={() => setNotice('')}
                aria-label={t(locale, 'Cerrar aviso', 'Dismiss notice')}
              >
                <X size={16} />
              </button>
            </div>
          ) : null}
          {children}
        </main>
        <footer className="footer">
          <span>© {new Date().getFullYear()} JavaQuest</span>
          <span>
            {t(locale, 'Curiosidad primero. Código después.', 'Curiosity first. Code next.')}
          </span>
          <Link href={`/${locale}/resources`}>
            {t(locale, 'Fuentes y herramientas', 'Sources and tools')}
          </Link>
        </footer>
      </div>
    </div>
  );
}
