'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useLearning } from './providers';
import { Brand } from './brand';
import { ThemeToggle } from './theme';
import { t } from '@/lib/i18n';
import { Button } from './ui/button';
export function PublicShell({ children }: { children: React.ReactNode }) {
  const { locale } = useLearning();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.body.style.overflow;
    if (open) {
      menu.current?.showModal();
      document.body.style.overflow = 'hidden';
    } else menu.current?.close();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  const links = [
    { href: `/${locale}#temario`, text: t(locale, 'Temario', 'Curriculum') },
    { href: `/${locale}/glossary`, text: t(locale, 'Glosario', 'Glossary') },
    { href: `/${locale}/projects`, text: t(locale, 'Proyectos', 'Projects') },
    { href: `/${locale}/resources`, text: t(locale, 'Herramientas', 'Tools') },
  ];
  return (
    <div className="public-shell">
      <a href="#main-content" className="skip-link">
        {t(locale, 'Saltar al contenido', 'Skip to content')}
      </a>
      <header className="public-header">
        <div className="public-header-inner">
          <Brand locale={locale} />
          <nav
            className="public-nav"
            aria-label={t(locale, 'Navegación principal', 'Main navigation')}
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={pathname === l.href ? 'page' : undefined}
              >
                {l.text}
              </Link>
            ))}
          </nav>
          <div className="public-actions">
            <Link
              className="locale-switch"
              href={pathname.replace(/^\/(es|en)/, locale === 'es' ? '/en' : '/es')}
              aria-label={t(locale, 'Cambiar idioma', 'Change language')}
            >
              {locale.toUpperCase()}
            </Link>
            <ThemeToggle locale={locale} />
            <Button asChild size="sm" className="public-enter">
              <Link href={`/${locale}/dashboard`}>
                {t(locale, 'Entrar a aprender', 'Start learning')}
                <ArrowUpRight size={16} />
              </Link>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="public-menu-toggle"
              onClick={() => setOpen(true)}
              aria-label={t(locale, 'Abrir menú', 'Open menu')}
            >
              <Menu size={22} />
            </Button>
          </div>
        </div>
      </header>
      <dialog
        aria-label={t(locale, 'Menú principal', 'Main menu')}
        ref={menu}
        className="public-menu-dialog"
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className="mobile-nav-header">
          <Brand locale={locale} />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setOpen(false)}
            aria-label={t(locale, 'Cerrar menú', 'Close menu')}
          >
            <X size={22} />
          </Button>
        </div>
        <nav aria-label={t(locale, 'Navegación móvil', 'Mobile navigation')}>
          {links.map((l) => (
            <Link href={l.href} key={l.href} onClick={() => setOpen(false)}>
              {l.text}
              <ArrowUpRight size={18} />
            </Link>
          ))}
          <Button asChild>
            <Link href={`/${locale}/dashboard`} onClick={() => setOpen(false)}>
              {t(locale, 'Entrar a aprender', 'Start learning')}
            </Link>
          </Button>
        </nav>
      </dialog>
      <main id="main-content">{children}</main>
      <footer className="public-footer">
        <div>
          <Brand locale={locale} />
          <p>
            {t(
              locale,
              'Aprende. Practica. Construye algo tuyo.',
              'Learn. Practice. Build something of your own.',
            )}
          </p>
          <span>© {new Date().getFullYear()} JavaQuest</span>
        </div>
        <nav aria-label={t(locale, 'Enlaces del pie', 'Footer links')}>
          <Link href={`/${locale}#temario`}>{t(locale, 'Ver temario', 'View curriculum')}</Link>
          <Link href={`/${locale}/glossary`}>{t(locale, 'Glosario Java', 'Java glossary')}</Link>
          <Link href={`/${locale}/resources`}>
            {t(locale, 'Fuentes y herramientas', 'Sources and tools')}
          </Link>
          <a href="https://github.com/DEIMER-PY/javaquest" target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight size={15} />
          </a>
        </nav>
        <div className="footer-tag">
          <span className="status-dot" />
          {t(locale, 'Para aprender juntos.', 'Made to learn together.')}
        </div>
      </footer>
    </div>
  );
}
