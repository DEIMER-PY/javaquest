'use client';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Download, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { projects, type Project } from '@/lib/projects';
import { t } from '@/lib/i18n';
import { useLearning } from './providers';
import { Button } from './ui/button';
import { CodeCopy } from './code-copy';
import { ProjectIcon } from './project-icon';
export function Projects() {
  const { locale } = useLearning();
  return (
    <>
      <div className="page-intro">
        <span className="eyebrow">
          {t(locale, 'IDEAS QUE SE CONVIERTEN EN CÓDIGO', 'IDEAS BECOME CODE')}
        </span>
        <h1>{t(locale, 'Construye algo tuyo.', 'Build something of your own.')}</h1>
        <p>
          {t(
            locale,
            'Proyectos pequeños, guiados paso a paso. Practica los fundamentos y termina con algo que funciona.',
            'Small projects, guided step by step. Practice the foundations and finish with something that works.',
          )}
        </p>
      </div>
      <div className="project-grid">
        {projects.map((project) => (
          <Link
            href={`/${locale}/projects/${project.id}`}
            className="card project-card"
            key={project.id}
          >
            <div className="feature-icon peach">
              <ProjectIcon id={project.id} size={25} />
            </div>
            <span className="eyebrow">
              {t(locale, 'DESDE UNIDAD', 'FROM UNIT')} {project.unit} · {project.minutes} MIN
            </span>
            <h2>{project.title[locale]}</h2>
            <p>{project.description[locale]}</p>
            <span className="text-link">
              {t(locale, 'Comenzar proyecto', 'Start project')}
              <ArrowRight size={16} />
            </span>
          </Link>
        ))}
      </div>
      <div className="notice mt-7">
        {t(
          locale,
          'Estos proyectos completos se ejecutan con tu JDK local. Su lógica se puede practicar en el playground con valores definidos en el código.',
          'Run these complete projects with your local JDK. Practice their logic in the playground using predefined values.',
        )}
      </div>
    </>
  );
}
export function ProjectGuide({ project }: { project: Project }) {
  const { locale, user, progress, refresh, setNotice } = useLearning();
  const [busy, setBusy] = useState(false);
  async function toggle(step: number, checked: boolean) {
    setBusy(true);
    try {
      if (user) {
        const r = await fetch('/api/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId: project.id, step, checked }),
        });
        if (!r.ok) throw Error();
      } else {
        const next = {
          ...progress,
          projectSteps: checked
            ? [...progress.projectSteps, { project_id: project.id, step }]
            : progress.projectSteps.filter((s) => s.project_id !== project.id || s.step !== step),
        };
        localStorage.setItem('javaquest-progress-v1', JSON.stringify(next));
      }
      await refresh();
    } catch {
      setNotice(t(locale, 'No se pudo guardar el paso.', 'Could not save this step.'));
    } finally {
      setBusy(false);
    }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([project.code], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Main.java';
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="project-details">
      <Link className="text-link mb-6" href={`/${locale}/projects`}>
        <ArrowLeft size={15} />
        {t(locale, 'Todos los proyectos', 'All projects')}
      </Link>
      <div className="page-intro">
        <span className="eyebrow">
          {project.minutes} MIN · {t(locale, 'PROYECTO GUIADO', 'GUIDED PROJECT')}
        </span>
        <h1>{project.title[locale]}</h1>
        <p>{project.description[locale]}</p>
      </div>
      <div className="card">
        <h2>{t(locale, 'Prepara tu espacio', 'Prepare your workspace')}</h2>
        <p className="mt-3">
          {t(
            locale,
            'Instala el JDK y crea una carpeta exclusiva para este proyecto. Guarda el programa como Main.java dentro de ella.',
            'Install a JDK and create a dedicated project folder. Save the program as Main.java inside it.',
          )}
        </p>
        <pre className="code-block">
          mkdir {project.id}
          {'\n'}cd {project.id}
          {'\n'}javac Main.java{'\n'}java Main
        </pre>
        <Link href={`/${locale}/resources`} className="text-link">
          {t(locale, 'Instalación paso a paso', 'Step-by-step installation')}
          <ArrowRight size={14} />
        </Link>
      </div>
      <div className="project-steps">
        {project.steps.map((step, i) => (
          <label className="project-step" key={i}>
            <input
              type="checkbox"
              disabled={busy}
              checked={progress.projectSteps.some(
                (x) => x.project_id === project.id && x.step === i,
              )}
              onChange={(e) => toggle(i, e.target.checked)}
            />
            <div>
              <strong>
                {i + 1}. {step.title[locale]}
              </strong>
              <p>{step.body[locale]}</p>
            </div>
          </label>
        ))}
      </div>
      <div className="card">
        <h2>{t(locale, 'Criterios para terminar', 'Completion criteria')}</h2>
        <ul className="mt-4 space-y-3">
          {project.checks.map((c) => (
            <li key={c.en} className="flex gap-3 text-sm">
              <CheckCircle2 size={18} className="text-primary shrink-0" />
              {c[locale]}
            </li>
          ))}
        </ul>
        <details>
          <summary>
            {t(locale, 'Ver implementación de referencia', 'View reference implementation')}
          </summary>
          <pre className="code-block">{project.code}</pre>
          <div className="flex gap-3 flex-wrap">
            <CodeCopy code={project.code} />
            <Button size="sm" onClick={download}>
              <Download size={14} />
              Main.java
            </Button>
          </div>
        </details>
        <Button asChild variant="outline">
          <Link href={`/${locale}/playground?lesson=${project.lesson}`}>
            {t(locale, 'Practicar la lógica en el navegador', 'Practice the logic in your browser')}
            <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
    </div>
  );
}
