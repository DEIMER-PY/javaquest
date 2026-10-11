import { Terminal, ArrowRight, Check, Braces } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/i18n';
export function CodePreview({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  return (
    <div className={`code-preview ${compact ? 'compact-preview' : ''}`}>
      <div className="window-bar">
        <span className="window-dots">
          <i />
          <i />
          <i />
        </span>
        <span>Main.java</span>
        <span className="file-language">JAVA</span>
      </div>
      <div
        className="preview-source"
        aria-label={t(locale, 'Ejemplo de programa Java', 'Java program example')}
      >
        <div>
          <span className="line-number">01</span>
          <code>
            <b>public class</b> <em>Main</em> {'{'}
          </code>
        </div>
        <div>
          <span className="line-number">02</span>
          <code>
            {' '}
            <b>public static void</b> <em>main</em>(String[] args) {'{'}
          </code>
        </div>
        <div>
          <span className="line-number">03</span>
          <code>
            {' '}
            <span className="syntax-comment">
              {'// '}
              {t(
                locale,
                'Tu primera línea. Tu próximo proyecto.',
                'Your first line. Your next project.',
              )}
            </span>
          </code>
        </div>
        <div>
          <span className="line-number">04</span>
          <code>
            {' '}
            System.out.<em>println</em>(
            <span className="syntax-string">&quot;Hola, JavaQuest!&quot;</span>);
          </code>
        </div>
        <div>
          <span className="line-number">05</span>
          <code> {'}'}</code>
        </div>
        <div>
          <span className="line-number">06</span>
          <code>{'}'}</code>
        </div>
      </div>
      <div className="preview-terminal">
        <span>
          <Terminal size={14} />
          {t(locale, 'SALIDA DEL EJEMPLO', 'EXAMPLE OUTPUT')}
        </span>
        <code>
          <b>❯</b> Hola, JavaQuest!
        </code>
        <div className="terminal-result">
          <Check size={13} />
          {t(locale, 'De una idea a un programa.', 'From an idea to a program.')}
        </div>
      </div>
      {!compact ? (
        <div
          className="compile-flow"
          aria-label={t(
            locale,
            'Código fuente, compilador, bytecode y JVM',
            'Source code, compiler, bytecode, and JVM',
          )}
        >
          <span>
            <Braces size={16} />
            .java
          </span>
          <ArrowRight size={15} />
          <span>javac</span>
          <ArrowRight size={15} />
          <span>.class</span>
          <ArrowRight size={15} />
          <span className="flow-accent">JVM</span>
        </div>
      ) : null}
    </div>
  );
}
