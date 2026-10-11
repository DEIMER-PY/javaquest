'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, Search, X, NotebookText } from 'lucide-react';
import { useLearning } from './providers';
import { t } from '@/lib/i18n';
import { glossary, categories, normalizeSearch, type GlossaryCategory } from '@/lib/glossary';
import { Button } from './ui/button';
export function Glossary() {
  const { locale } = useLearning();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<GlossaryCategory | 'all'>('all');
  const search = normalizeSearch(query);
  const list = glossary
    .filter(
      (entry) =>
        (category === 'all' || entry.category === category) &&
        normalizeSearch(
          [entry.term.es, entry.term.en, entry.definition.es, entry.definition.en].join(' '),
        ).includes(search),
    )
    .sort((a, b) => a.term[locale].localeCompare(b.term[locale], locale));
  return (
    <div className="landing-container glossary-page">
      <div className="glossary-heading">
        <span className="eyebrow">
          {'// '}
          {t(locale, 'TU DICCIONARIO DE JAVA', 'YOUR JAVA DICTIONARY')}
        </span>
        <h1>
          {t(locale, 'Entiende las palabras.', 'Understand the words.')}
          <br />
          <span>{t(locale, 'Después, el código.', 'Then, the code.')}</span>
        </h1>
        <p>
          {t(
            locale,
            'De JVM a ORM: conceptos claros, ejemplos breves y un siguiente paso para seguir aprendiendo.',
            'From JVM to ORM: clear concepts, short examples, and a next step to keep learning.',
          )}
        </p>
      </div>
      <div className="glossary-search">
        <Search size={20} />
        <label htmlFor="glossary-search" className="sr-only">
          {t(locale, 'Buscar conceptos', 'Search concepts')}
        </label>
        <input
          id="glossary-search"
          type="search"
          maxLength={100}
          placeholder={t(locale, 'Busca JVM, clase, compilador…', 'Search JVM, class, compiler…')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label={t(locale, 'Limpiar búsqueda', 'Clear search')}
            onClick={() => setQuery('')}
          >
            <X size={18} />
          </Button>
        ) : (
          <kbd>/ JAVA</kbd>
        )}
      </div>
      <div
        className="glossary-filters"
        role="group"
        aria-label={t(locale, 'Filtrar por categoría', 'Filter by category')}
      >
        <button aria-pressed={category === 'all'} onClick={() => setCategory('all')}>
          {t(locale, 'Todos', 'All')}
          <span>{glossary.length}</span>
        </button>
        {Object.entries(categories).map(([id, label]) => (
          <button
            key={id}
            aria-pressed={category === id}
            onClick={() => setCategory(id as GlossaryCategory)}
          >
            {label[locale]}
          </button>
        ))}
      </div>
      <div className="glossary-results" role="status">
        {list.length} {t(locale, 'conceptos encontrados', 'concepts found')}
      </div>
      {list.length ? (
        <div className="glossary-grid">
          {list.map((entry) => (
            <article className="glossary-card" key={entry.id} id={entry.id}>
              <div className="glossary-card-label">
                <span>{categories[entry.category][locale]}</span>
                <NotebookText size={17} />
              </div>
              <h2>{entry.term[locale]}</h2>
              <p>{entry.definition[locale]}</p>
              <div className="glossary-code-label">
                {t(locale, 'EJEMPLO', 'EXAMPLE')} / {entry.example.language.toUpperCase()}
              </div>
              <pre>
                <code>{entry.example.code}</code>
              </pre>
              {entry.lessonId ? (
                <Link href={`/${locale}/lessons/${entry.lessonId}`} className="text-link">
                  {t(locale, 'Ir a la lección', 'Go to the lesson')}
                  <ArrowUpRight size={16} />
                </Link>
              ) : (
                <Link href={`/${locale}/resources`} className="text-link">
                  {t(locale, 'Consultar herramientas', 'Explore tools')}
                  <ArrowUpRight size={16} />
                </Link>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="glossary-empty">
          <Search size={30} />
          <h2>{t(locale, 'Ese concepto aún no aparece.', 'That concept is not here yet.')}</h2>
          <p>
            {t(
              locale,
              'Prueba otra palabra o consulta todas las categorías.',
              'Try another word or browse all categories.',
            )}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setQuery('');
              setCategory('all');
            }}
          >
            {t(locale, 'Ver todos los conceptos', 'View all concepts')}
          </Button>
        </div>
      )}
    </div>
  );
}
