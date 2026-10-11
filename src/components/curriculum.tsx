'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, ChevronDown, Plus, Minus } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/i18n';
import { units, upcoming } from '@/lib/course';
import lessons from '@/lib/lessons.json';
import { UnitIcon } from './unit-icon';
import { Button } from './ui/button';
export function Curriculum({ locale }: { locale: Locale }) {
  const [expanded, setExpanded] = useState(() => new Set([1]));
  const all = expanded.size === units.length;
  return (
    <section className="landing-section curriculum-section" id="temario">
      <div className="section-title-row">
        <div>
          <span className="eyebrow">
            {'// '}
            {t(locale, 'EL CAMINO ESTÁ CLARO', 'THE PATH IS CLEAR')}
          </span>
          <h2>
            {t(locale, 'De tu primera línea', 'From your first line')}
            <br />
            <span>{t(locale, 'a tu primer proyecto.', 'to your first project.')}</span>
          </h2>
          <p>
            {t(
              locale,
              'Explora el temario antes de empezar. Cada unidad conecta teoría, práctica y un siguiente paso.',
              'Explore the curriculum before starting. Each unit connects theory, practice, and your next step.',
            )}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(all ? new Set() : new Set(units.map((u) => u.id)))}
        >
          {all ? <Minus size={16} /> : <Plus size={16} />}{' '}
          {all
            ? t(locale, 'Contraer todo', 'Collapse all')
            : t(locale, 'Expandir todo', 'Expand all')}
        </Button>
      </div>
      <div className="curriculum-meta">
        <span>
          {units.length} {t(locale, 'unidades', 'units')}
        </span>
        <i />
        <span>
          {lessons.length} {t(locale, 'lecciones disponibles', 'available lessons')}
        </span>
        <i />
        <span>ES / EN</span>
      </div>
      <div className="curriculum-list">
        {units.map((unit) => {
          const list = lessons.filter((l) => l.unit === unit.id);
          const open = expanded.has(unit.id);
          return (
            <section className={`curriculum-unit ${open ? 'expanded' : ''}`} key={unit.id}>
              <h3>
                <button
                  className="curriculum-toggle"
                  aria-expanded={open}
                  aria-controls={`unit-${unit.id}`}
                  onClick={() =>
                    setExpanded((current) => {
                      const next = new Set(current);
                      if (next.has(unit.id)) next.delete(unit.id);
                      else next.add(unit.id);
                      return next;
                    })
                  }
                >
                  <span className="curriculum-number">{String(unit.id).padStart(2, '0')}</span>
                  <span className="curriculum-unit-icon">
                    <UnitIcon name={unit.icon} />
                  </span>
                  <span className="curriculum-title">
                    <strong>{unit.title[locale]}</strong>
                    <span>{unit.description[locale]}</span>
                  </span>
                  <span className="curriculum-count">
                    {list.length} {t(locale, 'lecciones', 'lessons')}
                  </span>
                  <ChevronDown size={20} className="curriculum-chevron" />
                </button>
              </h3>
              <div id={`unit-${unit.id}`} className="curriculum-lessons" hidden={!open}>
                {list.map((lesson, index) => (
                  <Link key={lesson.id} href={`/${locale}/lessons/${lesson.id}`}>
                    <span className="lesson-index">{String(index + 1).padStart(2, '0')}</span>
                    <span>{lesson.title[locale]}</span>
                    <span className="lesson-type">
                      {t(locale, 'Teoría + práctica', 'Theory + practice')}
                    </span>
                    <ArrowUpRight size={16} />
                  </Link>
                ))}
                <div className="curriculum-unit-footer">
                  <span>{t(locale, 'Sin cuenta para empezar.', 'Start without an account.')}</span>
                  <Link href={`/${locale}/lessons/${list[0].id}`}>
                    {t(locale, 'Comenzar unidad', 'Start unit')}
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </section>
          );
        })}
      </div>
      <div className="future-route">
        <div>
          <span className="eyebrow">
            {'// '}
            {t(locale, 'LO QUE VIENE DESPUÉS', 'WHAT COMES NEXT')}
          </span>
          <h3>
            {t(locale, 'Un camino hacia proyectos reales.', 'A path toward real-world projects.')}
          </h3>
          <p>
            {t(
              locale,
              'El curso seguirá creciendo. Estas rutas están planificadas; las marcaremos como disponibles cuando estén completas.',
              'The course will keep growing. These paths are planned; we will mark them available when complete.',
            )}
          </p>
        </div>
        <div className="future-route-tags">
          {upcoming.map((route) => (
            <span key={route.en}>
              {route[locale]}
              <small>{t(locale, 'Próximamente', 'Upcoming')}</small>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
