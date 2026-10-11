'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  Code2,
  FolderCode,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  Rocket,
  Settings2,
  Flame,
  Sparkles,
  X,
  NotebookText,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from './ui/button';
import { Brand } from './brand';
import { ThemeToggle } from './theme';
import { useLearning } from './providers';
import { labels, t } from '@/lib/i18n';
import { dayKey, streak } from '@/lib/progress';
import { browserClient } from '@/lib/supabase/client';
const items = [
  ['/dashboard', Home, 'home'],
  ['/learn', BookOpen, 'learn'],
  ['/playground', Code2, 'playground'],
  ['/projects', FolderCode, 'projects'],
  ['/glossary', NotebookText, 'glossary'],
  ['/resources', GraduationCap, 'resources'],
  ['/profile', Settings2, 'profile'],
] as const;
function SidebarContent({ close }: { close: () => void }) {
  const { locale } = useLearning();
  const pathname = usePathname();
  const l = labels[locale];
  return (
    <>
      <div className="sidebar-brand">
        <Brand locale={locale} />
        <Button
          className="mobile-close"
          variant="ghost"
          size="icon"
          aria-label={t(locale, 'Cerrar menú', 'Close menu')}
          onClick={close}
        >
          <X size={21} />
        </Button>
      </div>
      <div className="sidebar-caption">
        {t(locale, 'TU ESPACIO DE APRENDIZAJE', 'YOUR LEARNING SPACE')}
      </div>
      <nav aria-label={t(locale, 'Navegación del curso', 'Course navigation')}>
        {items.map(([path, Icon, key]) => {
          const href = `/${locale}${path}`;
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              className={`nav-item ${active ? 'active' : ''}`}
              href={href}
              key={key}
              aria-current={active ? 'page' : undefined}
              onClick={close}
            >
              <Icon size={20} strokeWidth={1.7} />
              {l[key]}
              {key === 'playground' ? <span className="nav-tag">JAVA</span> : null}
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <Rocket size={23} />
          <strong>{t(locale, 'Código que entiendes.', 'Code you understand.')}</strong>
          <p>
            {t(
              locale,
              'Una idea, una práctica y un paso adelante.',
              'One idea, one practice, one step forward.',
            )}
          </p>
        </div>
        <Link href={`/${locale}`} className="source-link" onClick={close}>
          {t(locale, 'Explorar JavaQuest', 'Explore JavaQuest')}
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </>
  );
}
export function Shell({ children }: { children: React.ReactNode }) {
  const { locale, user, progress, notice, setNotice } = useLearning();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const l = labels[locale];
  useEffect(() => {
    const old = document.body.style.overflow;
    if (open) {
      dialog.current?.showModal();
      document.body.style.overflow = 'hidden';
    } else dialog.current?.close();
    return () => {
      document.body.style.overflow = old;
    };
  }, [open]);
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
      <aside className="sidebar desktop-sidebar">
        <SidebarContent close={() => setOpen(false)} />
      </aside>
      <dialog
        aria-label={t(locale, 'Menú del curso', 'Course menu')}
        ref={dialog}
        className="sidebar-dialog"
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className="mobile-sidebar">
          <SidebarContent close={() => setOpen(false)} />
        </div>
      </dialog>
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
              <Menu size={22} />
            </Button>
            <span className="breadcrumb">
              {t(locale, 'Aprende / Practica / Construye', 'Learn / Practice / Build')}
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
              className="locale-switch"
              href={pathname.replace(/^\/(es|en)/, locale === 'es' ? '/en' : '/es')}
              aria-label={l.language}
            >
              {locale.toUpperCase()}
            </Link>
            <ThemeToggle locale={locale} />
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setNotice('')}
                aria-label={t(locale, 'Cerrar aviso', 'Dismiss notice')}
              >
                <X size={17} />
              </Button>
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
