'use client';
import { useState } from 'react';
import { ArrowUpRight, Terminal, BookOpen, Monitor } from 'lucide-react';
import { useLearning } from './providers';
import { t } from '@/lib/i18n';
import { Button } from './ui/button';
import { CodeCopy } from './code-copy';
const installation = {
  Windows:
    'winget install EclipseAdoptium.Temurin.21.JDK\nwinget install Git.Git\nwinget install Microsoft.VisualStudioCode',
  macOS: 'brew install --cask temurin@21\nbrew install git\nbrew install --cask visual-studio-code',
  Linux:
    'sudo apt update\nsudo apt install openjdk-21-jdk git\n# Ubuntu / Debian: availability depends on distribution version',
};
export function Resources() {
  const { locale } = useLearning();
  const [os, setOs] = useState<keyof typeof installation>('Windows');
  return (
    <>
      <div className="page-intro">
        <span className="eyebrow">
          {t(locale, 'PREPARA TU CAJA DE HERRAMIENTAS', 'PREPARE YOUR TOOLBOX')}
        </span>
        <h1>{t(locale, 'Todo para empezar.', 'Everything to get started.')}</h1>
        <p>
          {t(
            locale,
            'Instalación, terminal, fuentes y recursos. Cada herramienta aparece cuando la necesitas.',
            'Installation, terminal, sources, and resources. Each tool appears when you need it.',
          )}
        </p>
      </div>
      <section className="card mb-6">
        <div className="flex items-center gap-3">
          <Terminal size={22} />
          <h2>
            {t(
              locale,
              'Instala Java y verifica tu entorno',
              'Install Java and verify your environment',
            )}
          </h2>
        </div>
        <p className="mt-3">
          {t(
            locale,
            'Usaremos Eclipse Temurin JDK 21 para proyectos locales. El playground no requiere instalación.',
            'We use Eclipse Temurin JDK 21 for local projects. The playground requires no installation.',
          )}
        </p>
        <div className="os-tabs">
          {Object.keys(installation).map((key) => (
            <Button
              key={key}
              size="sm"
              variant={os === key ? 'default' : 'outline'}
              onClick={() => setOs(key as keyof typeof installation)}
            >
              {key}
            </Button>
          ))}
        </div>
        <ol className="list-decimal pl-5 space-y-3 text-sm">
          <li>
            {t(
              locale,
              'Descarga el instalador de tu sistema desde',
              'Download your system installer from',
            )}{' '}
            <a
              className="text-link"
              href="https://adoptium.net/temurin/releases/?version=21"
              target="_blank"
              rel="noreferrer"
            >
              Eclipse Adoptium ↗
            </a>
            .{' '}
            {t(
              locale,
              'Elige JDK 21 y la arquitectura de tu equipo (x64 o ARM64).',
              'Choose JDK 21 and your machine architecture (x64 or ARM64).',
            )}
          </li>
          <li>
            {os === 'Windows'
              ? t(
                  locale,
                  'Ejecuta el instalador y habilita las opciones de PATH y JAVA_HOME. También puedes usar los comandos siguientes si tienes winget.',
                  'Run the installer and enable PATH and JAVA_HOME options. You can also use the following commands if winget is installed.',
                )
              : os === 'macOS'
                ? t(
                    locale,
                    'Instala el paquete .pkg. Los comandos siguientes son una alternativa si ya tienes Homebrew.',
                    'Install the .pkg package. The following commands are an alternative if Homebrew is already installed.',
                  )
                : t(
                    locale,
                    'En Ubuntu/Debian usa apt si tu versión ofrece openjdk-21-jdk; de lo contrario usa el archivo e instrucciones oficiales de Temurin.',
                    'On Ubuntu/Debian use apt if your version provides openjdk-21-jdk; otherwise use Temurin’s official archive and instructions.',
                  )}
          </li>
          <li>
            {t(
              locale,
              'Instala Git y VS Code, o utiliza IntelliJ IDEA con sus funciones gratuitas para Java. En VS Code instala Extension Pack for Java de Microsoft.',
              'Install Git and VS Code, or use IntelliJ IDEA’s free Java features. In VS Code install Microsoft’s Extension Pack for Java.',
            )}
          </li>
          <li>
            {t(
              locale,
              'Abre una terminal nueva y verifica ambas herramientas.',
              'Open a new terminal and verify both tools.',
            )}
          </li>
        </ol>
        <pre className="code-block">
          {installation[os]}
          {'\n\n'}java --version{'\n'}javac --version{'\n'}git --version
        </pre>
        <CodeCopy code={installation[os] + '\njava --version\njavac --version\ngit --version'} />
        <p className="mt-5 text-sm">
          {t(
            locale,
            'Si javac no se encuentra, revisa que instalaste el JDK. JAVA_HOME debe apuntar al directorio del JDK, y PATH incluir su carpeta bin. Reinicia la terminal después de cambiar las variables.',
            'If javac is not found, check that you installed a JDK. JAVA_HOME points to the JDK directory and PATH includes its bin folder. Restart the terminal after changing variables.',
          )}
        </p>
      </section>
      <div className="resource-grid">
        <section className="card">
          <Monitor size={22} />
          <h2 className="mt-3">
            {t(locale, 'Tu primer programa local', 'Your first local program')}
          </h2>
          <ol>
            <li>
              {t(
                locale,
                'Crea una carpeta y ábrela en tu editor.',
                'Create a folder and open it in your editor.',
              )}
            </li>
            <li>
              {t(
                locale,
                'Guarda el ejemplo de Hola, mundo como Main.java.',
                'Save the Hello, world example as Main.java.',
              )}
            </li>
            <li>
              {t(
                locale,
                'Abre la terminal en esa misma carpeta.',
                'Open a terminal in the same folder.',
              )}
            </li>
          </ol>
          <pre className="code-block">
            mkdir hola-java{'\n'}cd hola-java{'\n'}#{' '}
            {t(
              locale,
              'Crea Main.java con tu editor antes de compilar',
              'Create Main.java in your editor before compiling',
            )}
            {'\n'}javac Main.java{'\n'}java Main
          </pre>
          <p>
            {t(
              locale,
              'Resultado esperado: Hola, mundo. El archivo Main.class aparece al compilar. No ejecutes java Main.class.',
              'Expected output: Hola, mundo. Compilation creates Main.class. Do not run java Main.class.',
            )}
          </p>
        </section>
        <section className="card">
          <BookOpen size={22} />
          <h2 className="mt-3">{t(locale, 'Fuentes para profundizar', 'Sources to go deeper')}</h2>
          <p>
            {t(
              locale,
              'Consulta referencias oficiales y contrasta lo aprendido.',
              'Consult official references and cross-check what you learn.',
            )}
          </p>
          <ul className="space-y-4 mt-5">
            {[
              ['Java: Learn', 'https://dev.java/learn/'],
              ['Java SE 21 API', 'https://docs.oracle.com/en/java/javase/21/docs/api/'],
              [
                'Java history (Oracle)',
                'https://www.oracle.com/java/technologies/introduction-to-java.html',
              ],
              ['Spring Boot guides', 'https://spring.io/guides'],
              ['Eclipse Temurin installation', 'https://adoptium.net/installation/'],
              ['IntelliJ IDEA', 'https://www.jetbrains.com/idea/'],
              ['Git', 'https://git-scm.com/downloads'],
            ].map(([title, href]) => (
              <li key={href}>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={href}
                  className="flex items-center justify-between text-sm"
                >
                  {title}
                  <ArrowUpRight size={15} />
                </a>
              </li>
            ))}
          </ul>
        </section>
        <section className="card">
          <h2>{t(locale, 'Video y audio como complemento', 'Video and audio as a complement')}</h2>
          <p>
            {t(
              locale,
              'Estos recursos externos incluyen explicaciones en video. Selecciona una charla y usa subtítulos cuando estén disponibles; siempre vuelve a practicar el ejemplo.',
              'These external resources include video explanations. Pick a talk and use captions when available; always return to practice the example.',
            )}
          </p>
          <ul className="space-y-4">
            <li>
              <a href="https://www.youtube.com/java" target="_blank" rel="noreferrer">
                Java (Oracle) · EN ↗
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/@pildorasinformaticas/playlists"
                target="_blank"
                rel="noreferrer"
              >
                Píldoras Informáticas · ES ↗
              </a>
            </li>
          </ul>
          <p>
            {t(
              locale,
              'Los videos pertenecen a sus autores. Se enlazan sin descargarlos ni redistribuirlos.',
              'Videos belong to their authors. We link them without downloading or redistributing them.',
            )}
          </p>
        </section>
        <section className="card">
          <h2>{t(locale, 'Las siguientes herramientas', 'Your next tools')}</h2>
          <p>
            {t(
              locale,
              'Maven y Gradle administran construcción y dependencias. JUnit ayuda a verificar comportamiento. MySQL almacena datos; JDBC conecta Java con bases de datos; Hibernate implementa ORM y Spring Boot simplifica aplicaciones backend.',
              'Maven and Gradle manage builds and dependencies. JUnit verifies behavior. MySQL stores data; JDBC connects Java to databases; Hibernate provides ORM, and Spring Boot simplifies backend apps.',
            )}
          </p>
          <p>
            {t(
              locale,
              'Se incorporarán con instalación, ejemplos de terminal y proyectos en las próximas rutas. No necesitas instalarlas para completar el curso inicial.',
              'Upcoming paths will introduce them with installation, terminal examples, and projects. They are not required for the initial course.',
            )}
          </p>
          <a
            href="https://spring.io/guides/gs/accessing-data-mysql"
            target="_blank"
            rel="noreferrer"
          >
            Spring + MySQL ↗
          </a>
        </section>
      </div>
    </>
  );
}
