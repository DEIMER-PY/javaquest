import { notFound } from 'next/navigation';
import Link from 'next/link';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { compileMDX } from 'next-mdx-remote/rsc';
import { ArrowLeft, ArrowRight, Code2, Lightbulb } from 'lucide-react';
import lessons from '@/lib/lessons.json';
import { units, type Lesson } from '@/lib/course';
import { isLocale, t } from '@/lib/i18n';
import { Quiz } from '@/components/quiz';
import { CodeCopy } from '@/components/code-copy';
import { Button } from '@/components/ui/button';
import { JvmDiagram } from '@/components/jvm-diagram';
import Image from 'next/image';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id, locale } = await params;
  const lesson = lessons.find((x) => x.id === id);
  return { title: lesson && isLocale(locale) ? lesson.title[locale] : 'Lesson' };
}
export default async function LessonPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const index = lessons.findIndex((x) => x.id === id);
  if (index < 0) notFound();
  const lesson = lessons[index] as Lesson;
  const source = await readFile(
    path.join(process.cwd(), 'content', locale, `${lesson.id}.mdx`),
    'utf8',
  );
  const { content } = await compileMDX({
    source,
    components: {
      img: ({ src, alt }) =>
        src === '/images/jvm-flow.svg' ? (
          <JvmDiagram locale={locale} />
        ) : (
          <Image
            src={String(src)}
            alt={alt ?? ''}
            width={760}
            height={400}
            style={{ width: '100%', height: 'auto' }}
          />
        ),
    },
  });
  return (
    <>
      <Link href={`/${locale}/learn`} className="text-link mb-6">
        <ArrowLeft size={16} />
        {t(locale, 'Volver a la ruta', 'Back to the path')}
      </Link>
      <div className="page-intro">
        <span className="eyebrow">
          {t(locale, 'UNIDAD', 'UNIT')} {lesson.unit} · {units[lesson.unit - 1].title[locale]} ·{' '}
          {lesson.minutes} MIN
        </span>
        <h1>{lesson.title[locale]}</h1>
      </div>
      <div className="lesson-layout">
        <div className="lesson-content">
          <article className="card prose">
            {content}
            <div className="flex flex-wrap gap-3">
              <CodeCopy code={lesson.example} />
              <Button asChild size="sm">
                <Link href={`/${locale}/playground?lesson=${lesson.id}`}>
                  <Code2 size={16} />
                  {t(locale, 'Probar el ejemplo', 'Try the example')}
                </Link>
              </Button>
            </div>
            <details>
              <summary>{t(locale, 'Necesito una pista', 'I need a hint')}</summary>
              <p>{lesson.hint[locale]}</p>
            </details>
            <details>
              <summary>
                {t(locale, 'Ver una solución explicada', 'See an explained solution')}
              </summary>
              <p>
                {t(
                  locale,
                  'Compara esta solución con tu intento: identifica los valores de entrada, la operación y la salida. Reproduce el resultado y cambia una entrada para comprobar que entiendes el comportamiento.',
                  'Compare this solution with your attempt: identify input values, the operation, and the output. Reproduce the result and change an input to check your understanding.',
                )}
              </p>
              <pre>
                <code>{lesson.solution}</code>
              </pre>
              <CodeCopy code={lesson.solution} />
            </details>
          </article>
          <Quiz lesson={lesson} />
          <div className="lesson-nav">
            {index > 0 ? (
              <Button asChild variant="outline">
                <Link href={`/${locale}/lessons/${lessons[index - 1].id}`}>
                  <ArrowLeft size={16} />
                  {t(locale, 'Anterior', 'Previous')}
                </Link>
              </Button>
            ) : (
              <span />
            )}
            {index < lessons.length - 1 ? (
              <Button asChild>
                <Link href={`/${locale}/lessons/${lessons[index + 1].id}`}>
                  {t(locale, 'Siguiente lección', 'Next lesson')}
                  <ArrowRight size={16} />
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href={`/${locale}/projects`}>
                  {t(locale, 'Construir mi proyecto', 'Build my project')}
                  <ArrowRight size={16} />
                </Link>
              </Button>
            )}
          </div>
        </div>
        <aside className="lesson-aside card">
          <Lightbulb size={24} className="text-primary" />
          <h3 className="mt-4">{t(locale, 'Aprende con intención', 'Learn with intention')}</h3>
          <p>
            {t(
              locale,
              'Lee, predice la salida y después ejecuta. Dedica unos minutos a cambiar el ejemplo antes de mirar la solución.',
              'Read, predict the output, then run. Spend a few minutes changing the example before looking at the solution.',
            )}
          </p>
          <p>
            {t(
              locale,
              'Si un ejemplo necesita Scanner, archivos del sistema o herramientas externas, ejecútalo con el JDK local.',
              'If an example needs Scanner, system files, or external tools, run it with your local JDK.',
            )}
          </p>
          <Link href={`/${locale}/resources`} className="text-link">
            {t(locale, 'Guía de instalación', 'Installation guide')}
            <ArrowRight size={14} />
          </Link>
          <Link href={`/${locale}/glossary`} className="text-link mt-5">
            {t(locale, 'Consultar el glosario', 'Open the glossary')}
            <ArrowRight size={14} />
          </Link>
        </aside>
      </div>
    </>
  );
}
