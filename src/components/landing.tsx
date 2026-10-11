'use client';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Code2,
  FolderCode,
  NotebookText,
  Terminal,
  Braces,
  GitBranch,
  Database,
  Layers,
} from 'lucide-react';
import { useLearning } from './providers';
import { t } from '@/lib/i18n';
import { units } from '@/lib/course';
import lessons from '@/lib/lessons.json';
import { projects } from '@/lib/projects';
import { Button } from './ui/button';
import { Curriculum } from './curriculum';
import { CodePreview } from './code-preview';
import { ProjectIcon } from './project-icon';
const topics = [
  { name: 'Java', Icon: Braces },
  { name: 'POO', Icon: Layers },
  { name: 'Terminal', Icon: Terminal },
  { name: 'Git', Icon: GitBranch },
  { name: 'SQL', Icon: Database },
  { name: 'Spring Boot', Icon: Code2 },
];
export function Landing() {
  const { locale } = useLearning();
  const faq = [
    [
      t(locale, '¿Necesito saber programar?', 'Do I need programming experience?'),
      t(
        locale,
        'No. Comenzamos por qué es Java, cómo instalar el JDK y cómo escribir tu primer programa. Cada unidad construye sobre la anterior.',
        'No. We start with what Java is, how to install a JDK, and how to write your first program. Each unit builds on the previous one.',
      ),
    ],
    [
      t(
        locale,
        '¿Puedo aprender sin crear una cuenta?',
        'Can I learn without creating an account?',
      ),
      t(
        locale,
        'Sí. El temario, las lecciones, los proyectos y el playground están abiertos. Tu práctica puede guardarse en este navegador; la sincronización de cuentas llegará después.',
        'Yes. The curriculum, lessons, projects, and playground are open. Practice can be saved in this browser; account syncing will come later.',
      ),
    ],
    [
      t(locale, '¿El playground ejecuta Java real?', 'Does the playground run real Java?'),
      t(
        locale,
        'Sí: compila con javac y TeaVM en tu navegador. Cubre los fundamentos del curso. Scanner, Spring Boot y MySQL se ejecutan en tu equipo con el JDK local.',
        'Yes: it compiles with javac and TeaVM in your browser. It supports the course foundations. Run Scanner, Spring Boot, and MySQL locally with a JDK.',
      ),
    ],
    [
      t(locale, '¿Puedo estudiar desde mi teléfono?', 'Can I study on my phone?'),
      t(
        locale,
        'Sí. Puedes leer, repasar y practicar ejemplos sencillos en el teléfono. Para proyectos de terminal y herramientas de desarrollo recomendamos una computadora.',
        'Yes. Read, review, and practice simple examples on your phone. For terminal projects and development tools we recommend a computer.',
      ),
    ],
    [
      t(
        locale,
        '¿Todo el recorrido avanzado ya está disponible?',
        'Is the entire advanced path available now?',
      ),
      t(
        locale,
        'Hay treinta lecciones iniciales y tres proyectos guiados disponibles. Las rutas de bases de datos, ORM y Spring Boot están señaladas como próximas.',
        'Thirty initial lessons and three guided projects are available. Database, ORM, and Spring Boot paths are marked as upcoming.',
      ),
    ],
    [
      t(locale, '¿Dónde están el código y las fuentes?', 'Where are the code and references?'),
      t(
        locale,
        'El proyecto es abierto y está en GitHub. En Herramientas encontrarás documentación oficial de Java, instalación y recursos complementarios.',
        'The project is open source on GitHub. Tools includes official Java documentation, installation guides, and complementary resources.',
      ),
    ],
  ];
  return (
    <>
      <section className="landing-hero">
        <div className="hero-background-grid" aria-hidden="true" />
        <div className="landing-container hero-layout">
          <div className="landing-hero-copy">
            <span className="eyebrow hero-eyebrow">
              <span className="status-dot" />
              {t(locale, 'APRENDE JAVA · GRATIS · A TU RITMO', 'LEARN JAVA · FREE · AT YOUR PACE')}
            </span>
            <h1>
              {t(locale, 'De cero a', 'From zero to')}
              <br />
              <span className="headline-highlight">
                {t(locale, 'proyectos reales', 'real projects')}
              </span>
              <br />
              {t(locale, 'con Java.', 'with Java.')}
            </h1>
            <p className="hero-description">
              {t(
                locale,
                'Entiende lo que escribes. Practica con código real y transforma cada concepto en algo que funciona. Tu próxima idea empieza aquí.',
                'Understand what you write. Practice with real code and turn every concept into something that works. Your next idea starts here.',
              )}
            </p>
            <div className="hero-actions">
              <Button asChild size="lg">
                <Link href={`/${locale}/lessons/java-story`}>
                  {t(locale, 'Comenzar con Java', 'Start with Java')}
                  <ArrowUpRight size={19} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#temario">
                  {t(locale, 'Ver temario', 'View curriculum')}
                  <ArrowRight size={17} />
                </a>
              </Button>
            </div>
            <div className="hero-assurances">
              <span>
                <Check size={15} />
                {t(locale, 'Sin experiencia previa', 'No experience needed')}
              </span>
              <span>
                <Check size={15} />
                {t(locale, 'Sin cuenta para empezar', 'No account needed to start')}
              </span>
            </div>
            <div className="hero-stats">
              <div>
                <strong>{units.length.toString().padStart(2, '0')}</strong>
                <span>{t(locale, 'unidades', 'units')}</span>
              </div>
              <div>
                <strong>{lessons.length}</strong>
                <span>{t(locale, 'lecciones', 'lessons')}</span>
              </div>
              <div>
                <strong>{projects.length.toString().padStart(2, '0')}</strong>
                <span>{t(locale, 'proyectos', 'projects')}</span>
              </div>
              <div>
                <strong>ES/EN</strong>
                <span>{t(locale, 'a tu manera', 'your way')}</span>
              </div>
            </div>
          </div>
          <div className="hero-code-stage">
            <div className="code-stage-label">
              <span className="status-dot" />
              {t(locale, 'MENOS MEMORIZAR. MÁS ENTENDER.', 'LESS MEMORIZING. MORE UNDERSTANDING.')}
            </div>
            <CodePreview locale={locale} />
            <div className="code-stage-caption">
              <span>
                <Code2 size={16} />
                {t(locale, 'Tu código tiene un siguiente paso.', 'Your code has a next step.')}
              </span>
              <Link href={`/${locale}/playground`}>
                {t(locale, 'Abrir playground', 'Open playground')}
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div className="technology-strip">
        <div className="landing-container">
          <span>{t(locale, 'TU CAJA DE HERRAMIENTAS', 'YOUR TOOLBOX')}</span>
          <div>
            {topics.map(({ name, Icon }) => (
              <span key={name}>
                <Icon size={18} strokeWidth={1.6} />
                {name === 'POO' && locale === 'en' ? 'OOP' : name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="landing-container">
        <section className="learning-principles">
          <div>
            <span className="principle-index">01 /</span>
            <BookOpen size={23} />
            <h2>{t(locale, 'Entiende el concepto.', 'Understand the concept.')}</h2>
            <p>
              {t(
                locale,
                'Explicaciones claras y ejemplos que conectan con el mundo real.',
                'Clear explanations and examples connected to real-world ideas.',
              )}
            </p>
          </div>
          <div>
            <span className="principle-index">02 /</span>
            <Code2 size={23} />
            <h2>{t(locale, 'Pruébalo tú mismo.', 'Try it yourself.')}</h2>
            <p>
              {t(
                locale,
                'Cambia una línea, ejecuta el programa y descubre por qué funciona.',
                'Change a line, run the program, and discover why it works.',
              )}
            </p>
          </div>
          <div>
            <span className="principle-index">03 /</span>
            <FolderCode size={23} />
            <h2>{t(locale, 'Construye algo tuyo.', 'Build something of your own.')}</h2>
            <p>
              {t(
                locale,
                'Proyectos pequeños que reúnen todo lo que vas aprendiendo.',
                'Small projects bringing together everything you learn.',
              )}
            </p>
          </div>
        </section>
        <Curriculum locale={locale} />
        <section className="glossary-feature landing-section">
          <div>
            <span className="eyebrow">
              {'// '}
              {t(locale, 'PRIMERO, ENTENDER EL IDIOMA', 'FIRST, UNDERSTAND THE LANGUAGE')}
            </span>
            <h2>
              {t(locale, '¿JVM? ¿Bytecode?', 'JVM? Bytecode?')}
              <br />
              {t(locale, 'Aquí todo tiene sentido.', 'It all makes sense here.')}
            </h2>
            <p>
              {t(
                locale,
                'Un glosario para consultar antes, durante y después de tus lecciones. Definiciones, ejemplos y conexiones con el temario.',
                'A glossary to consult before, during, and after lessons. Definitions, examples, and connections to the curriculum.',
              )}
            </p>
            <Button asChild variant="outline">
              <Link href={`/${locale}/glossary`}>
                <NotebookText size={18} />
                {t(locale, 'Explorar el glosario', 'Explore the glossary')}
                <ArrowUpRight size={17} />
              </Link>
            </Button>
          </div>
          <div className="glossary-preview-grid">
            <div>
              <span>01 / JVM</span>
              <h3>{t(locale, 'Tu código, en movimiento.', 'Your code, in motion.')}</h3>
              <p>
                {t(
                  locale,
                  'La máquina virtual que ejecuta el bytecode de Java.',
                  'The virtual machine that executes Java bytecode.',
                )}
              </p>
              <code>java Main</code>
            </div>
            <div>
              <span>02 / JDK</span>
              <h3>{t(locale, 'Tu kit de construcción.', 'Your building toolkit.')}</h3>
              <p>
                {t(
                  locale,
                  'Las herramientas para desarrollar y compilar programas Java.',
                  'The tools for developing and compiling Java programs.',
                )}
              </p>
              <code>javac Main.java</code>
            </div>
            <div className="glossary-preview-wide">
              <span>03 / {t(locale, 'CLASE', 'CLASS')}</span>
              <p>
                {t(
                  locale,
                  'Un tipo que reúne estado y comportamiento. El comienzo de pensar en objetos.',
                  'A type bringing together state and behavior. The start of thinking in objects.',
                )}
              </p>
              <code>class Tarea {'{ ... }'}</code>
            </div>
          </div>
        </section>
        <section className="landing-section public-projects">
          <div className="section-title-row">
            <div>
              <span className="eyebrow">
                {'// '}
                {t(locale, 'APRENDE HACIENDO', 'LEARN BY DOING')}
              </span>
              <h2>
                {t(locale, 'Pequeños proyectos.', 'Small projects.')}
                <br />
                <span>{t(locale, 'Grandes primeros pasos.', 'Big first steps.')}</span>
              </h2>
            </div>
            <Link className="text-link" href={`/${locale}/projects`}>
              {t(locale, 'Ver proyectos', 'View projects')}
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="public-project-grid">
            {projects.map((project, i) => (
              <Link
                className="public-project-card"
                href={`/${locale}/projects/${project.id}`}
                key={project.id}
              >
                <span className="project-card-number">0{i + 1}</span>
                <ProjectIcon id={project.id} size={33} />
                <span className="eyebrow">
                  {t(locale, 'DESDE UNIDAD', 'FROM UNIT')} {project.unit}
                </span>
                <h3>{project.title[locale]}</h3>
                <p>{project.description[locale]}</p>
                <span className="project-link">
                  {t(locale, 'Explorar proyecto', 'Explore project')}
                  <ArrowUpRight size={18} />
                </span>
              </Link>
            ))}
          </div>
        </section>
        <section className="faq-section landing-section">
          <div>
            <span className="eyebrow">{'// '}FAQ</span>
            <h2>
              {t(locale, 'Antes de escribir', 'Before writing')}
              <br />
              {t(locale, 'tu primera línea.', 'your first line.')}
            </h2>
            <p>
              {t(
                locale,
                'Resolvamos las preguntas que todos tenemos al empezar.',
                'Let’s answer the questions we all have when starting.',
              )}
            </p>
          </div>
          <div className="faq-list">
            {faq.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span>+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="final-cta">
          <span className="eyebrow">
            {'// '}
            {t(locale, 'EL SIGUIENTE PASO ES TUYO', 'THE NEXT STEP IS YOURS')}
          </span>
          <h2>
            {t(locale, 'Tu primer programa', 'Your first program')}
            <br />
            {t(locale, 'está a una línea.', 'is one line away.')}
          </h2>
          <Button asChild size="lg">
            <Link href={`/${locale}/lessons/java-story`}>
              {t(locale, 'Empezar a aprender', 'Start learning')}
              <ArrowUpRight size={19} />
            </Link>
          </Button>
          <p>
            {t(
              locale,
              'Gratis. En español e inglés. Desde cero.',
              'Free. In Spanish and English. From scratch.',
            )}
          </p>
        </section>
      </div>
    </>
  );
}
