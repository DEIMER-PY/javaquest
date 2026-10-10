'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Flame, Sparkles, BookOpen, Trophy, Flag, Rocket, Save } from 'lucide-react';
import { useLearning } from './providers';
import { t } from '@/lib/i18n';
import { dayKey, streak } from '@/lib/progress';
import { Button } from './ui/button';
export function Profile() {
  const { locale, user, progress, refresh, setNotice } = useLearning();
  const [name, setName] = useState<string | null>(null);
  const [timezone, setTimezone] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const count = progress.completions.length;
  const days = streak(
    progress.activity,
    dayKey(new Date(), progress.profile?.timezone ?? 'America/Bogota'),
  );
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await fetch('/api/progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: name ?? progress.profile?.display_name ?? user?.name,
          timezone: timezone ?? progress.profile?.timezone ?? 'America/Bogota',
          locale,
        }),
      });
      if (!r.ok) throw Error();
      await refresh();
      setNotice(t(locale, 'Perfil actualizado.', 'Profile updated.'));
    } catch {
      setNotice(
        t(
          locale,
          'No se pudo guardar. Revisa los datos y la conexión.',
          'Could not save. Check the data and your connection.',
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  const badges = [
    {
      Icon: Rocket,
      unlocked: count >= 1,
      title: t(locale, 'Primera línea', 'First line'),
      body: t(locale, 'Completa una lección', 'Complete one lesson'),
    },
    {
      Icon: Flag,
      unlocked: count >= 5,
      title: t(locale, 'Explorador Java', 'Java explorer'),
      body: t(locale, 'Completa cinco lecciones', 'Complete five lessons'),
    },
    {
      Icon: Trophy,
      unlocked: count >= 30,
      title: t(locale, 'Constructor de ideas', 'Idea builder'),
      body: t(locale, 'Completa la ruta inicial', 'Complete the initial path'),
    },
  ];
  return (
    <>
      <div className="page-intro">
        <span className="eyebrow">{t(locale, 'CADA PASO CUENTA', 'EVERY STEP COUNTS')}</span>
        <h1>{t(locale, 'Mira cuánto has avanzado.', 'See how far you have come.')}</h1>
        <p>
          {user
            ? t(
                locale,
                'Tu aprendizaje se sincroniza entre tus dispositivos.',
                'Your learning syncs across your devices.',
              )
            : t(
                locale,
                'Tu práctica se guarda en este navegador. Inicia sesión para sincronizar y registrar rachas.',
                'Practice is saved in this browser. Sign in to sync and track streaks.',
              )}
        </p>
      </div>
      <div className="stats-grid">
        <section className="card">
          <BookOpen size={21} />
          <h2>
            {count}
            <span className="text-base text-muted-foreground"> / 30</span>
          </h2>
          <p>{t(locale, 'Lecciones completadas', 'Completed lessons')}</p>
        </section>
        <section className="card">
          <Sparkles size={21} />
          <h2>{progress.completions.reduce((s, c) => s + c.xp, 0)}</h2>
          <p>{t(locale, 'Experiencia total', 'Total experience')}</p>
        </section>
        <section className="card">
          <Flame size={21} />
          <h2>{days}</h2>
          <p>{t(locale, 'Días de racha', 'Streak days')}</p>
        </section>
      </div>
      <div className="profile-grid">
        <section className="card">
          <h2>{t(locale, 'Tu espacio', 'Your space')}</h2>
          {user ? (
            <form onSubmit={save}>
              <div className="field">
                <label htmlFor="display-name">{t(locale, 'Nombre', 'Name')}</label>
                <input
                  id="display-name"
                  required
                  maxLength={60}
                  value={name ?? progress.profile?.display_name ?? user.name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="timezone">
                  {t(locale, 'Zona horaria para tu racha', 'Time zone for your streak')}
                </label>
                <select
                  id="timezone"
                  value={timezone ?? progress.profile?.timezone ?? 'America/Bogota'}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  {[
                    'America/Bogota',
                    'America/Mexico_City',
                    'America/Lima',
                    'America/Argentina/Buenos_Aires',
                    'America/New_York',
                    'Europe/Madrid',
                    'UTC',
                  ].map((zone) => (
                    <option key={zone}>{zone}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" disabled={busy}>
                <Save size={15} />
                {t(locale, 'Guardar perfil', 'Save profile')}
              </Button>
            </form>
          ) : (
            <>
              <p className="my-5">
                {t(
                  locale,
                  'Crea tu cuenta gratis para continuar desde cualquier dispositivo.',
                  'Create your free account to continue from any device.',
                )}
              </p>
              <Button asChild>
                <Link href={`/${locale}/login`}>{t(locale, 'Iniciar sesión', 'Sign in')}</Link>
              </Button>
            </>
          )}
        </section>
        <section className="card">
          <h2>{t(locale, 'Pequeñas victorias', 'Small victories')}</h2>
          <div className="badge-list">
            {badges.map(({ Icon, unlocked, title, body }) => (
              <div className={`badge-card ${unlocked ? 'unlocked' : ''}`} key={title}>
                <Icon size={26} />
                <div>
                  <strong>{title}</strong>
                  <small>{body}</small>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
