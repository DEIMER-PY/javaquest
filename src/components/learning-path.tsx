'use client';
import Link from 'next/link';
import { BookOpen, Check, ChevronRight, Flag } from 'lucide-react';
import { useLearning } from './providers';
import { UnitIcon } from './unit-icon';
import { labels, t } from '@/lib/i18n';
import { units, upcoming } from '@/lib/course';
import lessons from '@/lib/lessons.json';
export function LearningPath() {
  const { locale, progress } = useLearning();
  const done = new Set(progress.completions.map((x) => x.lesson_id));
  return (
    <>
      <div className="page-intro">
        <span className="eyebrow">
          {t(locale, 'UN CAMINO, MUCHAS POSIBILIDADES', 'ONE PATH, MANY POSSIBILITIES')}
        </span>
        <h1>{t(locale, 'Tu ruta de aprendizaje', 'Your learning path')}</h1>
        <p>
          {t(
            locale,
            'Desde tu primera línea hasta proyectos que resuelven problemas. Puedes repasar cualquier lección a tu ritmo.',
            'From your first line to projects solving real problems. Review any lesson at your own pace.',
          )}
        </p>
      </div>
      {units.map((unit) => (
        <section key={unit.id} className="course-section">
          <div className={`unit-card tone-${unit.color}`}>
            <div className="unit-icon">
              <UnitIcon name={unit.icon} size={25} />
            </div>
            <div className="unit-body">
              <span className="unit-label">
                {labels[locale].unit} {unit.id}
              </span>
              <h2>{unit.title[locale]}</h2>
              <p>{unit.description[locale]}</p>
            </div>
            <span className="level-chip">
              {lessons.filter((l) => l.unit === unit.id && done.has(l.id)).length}/
              {lessons.filter((l) => l.unit === unit.id).length}
            </span>
          </div>
          <div className="lesson-list">
            {lessons
              .filter((l) => l.unit === unit.id)
              .map((lesson, index) => (
                <Link
                  className="lesson-link"
                  href={`/${locale}/lessons/${lesson.id}`}
                  key={lesson.id}
                >
                  <span className="lesson-node">
                    {done.has(lesson.id) ? <Check size={18} /> : index + 1}
                  </span>
                  <span>
                    <strong>{lesson.title[locale]}</strong>
                    <small>
                      {done.has(lesson.id)
                        ? labels[locale].completed
                        : t(locale, 'Teoría · ejemplo · práctica', 'Theory · example · practice')}
                    </small>
                  </span>
                  <span className="lesson-duration">{lesson.minutes} min</span>
                  <ChevronRight size={16} />
                </Link>
              ))}
          </div>
        </section>
      ))}
      <div className="section-heading">
        <h2>{t(locale, 'El camino continúa', 'The path continues')}</h2>
        <BookOpen size={20} />
      </div>
      <div className="upcoming-grid">
        {upcoming.map((route) => (
          <div className="upcoming-card" key={route.en}>
            <Flag size={19} />
            <div>
              <h3>{route[locale]}</h3>
              <span>{labels[locale].coming}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
