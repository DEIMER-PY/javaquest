'use client';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Code2,
  Flame,
  FolderCode,
  Lightbulb,
  Play,
  Rocket,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react';
import { Button } from './ui/button';
import { useLearning } from './providers';
import { labels, t } from '@/lib/i18n';
import { units } from '@/lib/course';
import lessons from '@/lib/lessons.json';
import { dayKey, streak } from '@/lib/progress';
export function Dashboard() {
  const { locale, user, progress } = useLearning();
  const l = labels[locale];
  const done = new Set(progress.completions.map((c) => c.lesson_id));
  const next = lessons.find((x) => !done.has(x.id)) ?? lessons[0];
  const today = dayKey(new Date(), progress.profile?.timezone ?? 'America/Bogota');
  const days = streak(progress.activity, today);
  const active = progress.activity.includes(today);
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            <span className="tiny-dot" />
            {t(
              locale,
              'TU PRÓXIMO GRAN PROYECTO EMPIEZA AQUÍ',
              'YOUR NEXT GREAT PROJECT STARTS HERE',
            )}
          </div>
          <h1>
            {t(locale, 'Hola', 'Hello')}, {progress.profile?.display_name ?? user?.name ?? l.guest}
            <span className="wave"> 👋</span>
          </h1>
          <p>
            {t(
              locale,
              'Un poco de curiosidad. Un poco de código. Un gran paso adelante.',
              'A little curiosity. A little code. A big step forward.',
            )}
          </p>
        </div>
        <span className="level-chip">
          <Sparkles size={15} />
          {t(locale, 'Nivel', 'Level')} {1 + Math.floor(done.size / 5)}
        </span>
      </div>
      <section className="hero-card">
        <div className="hero-copy">
          <span className="hero-badge">
            <span /> {t(locale, 'DE CERO A TU PRIMER PROYECTO', 'FROM ZERO TO YOUR FIRST PROJECT')}
          </span>
          <h2>
            {t(locale, 'Tu aventura con Java', 'Your Java adventure')}
            <br />
            <span>{t(locale, 'comienza con una línea.', 'starts with one line.')}</span>
          </h2>
          <p>
            {t(
              locale,
              'Aprende a tu ritmo, experimenta con código real y construye algo que puedas llamar tuyo.',
              'Learn at your pace, experiment with real code, and build something you can call your own.',
            )}
          </p>
          <Button asChild size="lg">
            <Link href={`/${locale}/lessons/${next.id}`}>
              {done.size ? l.continue : l.start}
              <ArrowRight size={18} />
            </Link>
          </Button>
          <div className="hero-meta">
            <Check size={15} />
            {t(locale, 'Sin experiencia previa', 'No experience needed')}
            <span>·</span>
            <Check size={15} />
            {t(locale, '100% gratuito', '100% free')}
          </div>
        </div>
        <div className="hero-art">
          <span className="art-code code-one">
            System.out.println(<span>&quot;Hola!&quot;</span>);
          </span>
          <Image
            src="/images/java-bot.svg"
            width={440}
            height={340}
            alt={t(
              locale,
              'Byte, nuestro robot compañero de aprendizaje',
              'Byte, our learning companion robot',
            )}
            priority
          />
          <span className="art-code code-two">
            <span>public class</span> TuFuturo {'{ }'}
          </span>
        </div>
      </section>
      <div className="dashboard-grid">
        <div className="dashboard-main">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                {t(locale, 'PASO A PASO, SIN SALTARTE NADA', 'STEP BY STEP, NOTHING SKIPPED')}
              </span>
              <h2>{t(locale, 'Tu ruta de aprendizaje', 'Your learning path')}</h2>
            </div>
            <Link href={`/${locale}/learn`} className="text-link">
              {t(locale, 'Ver toda la ruta', 'View full path')}
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="unit-list">
            {units.slice(0, 3).map((unit, i) => {
              const unitLessons = lessons.filter((x) => x.unit === unit.id);
              const count = unitLessons.filter((x) => done.has(x.id)).length;
              const first = unitLessons.find((x) => !done.has(x.id)) ?? unitLessons[0];
              return (
                <Link
                  key={unit.id}
                  href={`/${locale}/lessons/${first.id}`}
                  className={`unit-card tone-${unit.color}`}
                >
                  <div className="unit-icon">
                    {i === 0 ? (
                      <Rocket size={27} />
                    ) : i === 1 ? (
                      <Code2 size={27} />
                    ) : (
                      <Target size={27} />
                    )}
                  </div>
                  <div className="unit-body">
                    <span className="unit-label">
                      {l.unit} {String(unit.id).padStart(2, '0')}
                    </span>
                    <h3>{unit.title[locale]}</h3>
                    <p>{unit.description[locale]}</p>
                    <div className="unit-meta">
                      <BookOpen size={13} />
                      {unitLessons.length} {l.lessons}
                      <span>·</span>
                      {count}/{unitLessons.length} {t(locale, 'completadas', 'completed')}
                    </div>
                  </div>
                  <ChevronRight className="unit-arrow" size={20} />
                </Link>
              );
            })}
          </div>
          <div className="section-heading compact">
            <h2>{t(locale, 'Aprender haciendo', 'Learn by doing')}</h2>
            <span className="muted">
              {t(locale, 'Aquí la teoría cobra vida', 'Where theory comes to life')}
            </span>
          </div>
          <div className="feature-grid">
            <Link href={`/${locale}/playground`} className="feature-card">
              <div className="feature-icon">
                <Code2 />
              </div>
              <h3>{t(locale, 'Un espacio para experimentar', 'A space to experiment')}</h3>
              <p>
                {t(
                  locale,
                  'Escribe, ejecuta y descubre. Java real en tu navegador.',
                  'Write, run, and discover. Real Java in your browser.',
                )}
              </p>
              <span className="text-link">
                {t(locale, 'Abrir playground', 'Open playground')}
                <ArrowRight size={16} />
              </span>
              <div className="mini-code">
                <span>01</span> public class Main {'{'}
                <br />
                <span>02</span> &nbsp; // {t(locale, 'tu próxima idea', 'your next idea')}
                <br />
                <span>03</span> {'}'}
              </div>
            </Link>
            <Link href={`/${locale}/projects`} className="feature-card">
              <div className="feature-icon peach">
                <FolderCode />
              </div>
              <h3>{t(locale, 'Pequeños proyectos, grandes ideas', 'Small projects, big ideas')}</h3>
              <p>
                {t(
                  locale,
                  'Construye una calculadora, un juego y tu gestor de tareas.',
                  'Build a calculator, a game, and your own task manager.',
                )}
              </p>
              <span className="text-link">
                {t(locale, 'Explorar proyectos', 'Explore projects')}
                <ArrowRight size={16} />
              </span>
              <div className="project-tags">
                <span>Calculadora</span>
                <span>Guess the number</span>
                <span>Task manager</span>
              </div>
            </Link>
          </div>
        </div>
        <aside className="dashboard-aside">
          <section className="daily-card">
            <div className="daily-head">
              <span className="daily-icon">
                <Flame size={25} />
              </span>
              <span>{t(locale, 'LA CONSTANCIA CUENTA', 'CONSISTENCY COUNTS')}</span>
            </div>
            <h3>
              {days} {t(locale, 'días de racha', 'day streak')}
            </h3>
            <p>
              {user
                ? t(
                    locale,
                    'Completa una lección o repaso evaluado hoy para sumar tu día.',
                    'Complete a lesson or assessed review today to earn your day.',
                  )
                : t(
                    locale,
                    'Inicia sesión para guardar tu racha entre dispositivos.',
                    'Sign in to save your streak across devices.',
                  )}
            </p>
            <div className="week-strip">
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date(today + 'T12:00:00Z');
                date.setUTCDate(date.getUTCDate() - 6 + i);
                const key = date.toISOString().slice(0, 10);
                const checked = progress.activity.includes(key);
                return (
                  <div key={key}>
                    <span>
                      {new Intl.DateTimeFormat(locale, {
                        weekday: 'narrow',
                        timeZone: 'UTC',
                      }).format(date)}
                    </span>
                    <span
                      className={`day-circle ${checked ? 'checked' : ''} ${i === 6 ? 'today' : ''}`}
                    >
                      {checked ? <Check size={15} /> : <span />}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="daily-goal">
              <Target size={16} />
              {t(locale, 'Meta diaria', 'Daily goal')}
              <strong>{active ? '1' : '0'} / 1</strong>
            </div>
            <div className="progress-track">
              <span style={{ width: active ? '100%' : '0%' }} />
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/${locale}/lessons/${next.id}`}>
                <Play size={15} />
                {t(locale, 'Mi sesión de hoy', 'My session today')}
              </Link>
            </Button>
          </section>
          <section className="tip-card">
            <Lightbulb size={22} />
            <span className="eyebrow">{t(locale, 'UN CONSEJO DE BYTE', 'A TIP FROM BYTE')}</span>
            <h3>{t(locale, 'No necesitas saberlo todo.', 'You don’t need to know it all.')}</h3>
            <p>
              {t(
                locale,
                'Predice qué hará tu código antes de ejecutarlo. Equivocarte también es aprender.',
                'Predict what your code will do before running it. Getting it wrong is learning too.',
              )}
            </p>
          </section>
          <section className="achievement-card">
            <Trophy size={24} />
            <div>
              <h3>{t(locale, 'Tu primer logro te espera', 'Your first achievement awaits')}</h3>
              <p>
                {done.size
                  ? t(
                      locale,
                      `${done.size} lecciones superadas. ¡Sigue así!`,
                      `${done.size} lessons completed. Keep going!`,
                    )
                  : t(locale, 'Completa tu primera lección.', 'Complete your first lesson.')}
              </p>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
