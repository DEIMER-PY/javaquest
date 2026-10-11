import { ArrowRight, FileCode2, Cpu, Package } from 'lucide-react';
import { t, type Locale } from '@/lib/i18n';
export function JvmDiagram({ locale }: { locale: Locale }) {
  return (
    <span
      className="jvm-diagram"
      role="img"
      aria-label={t(
        locale,
        'Main.java se compila con javac a Main.class; la JVM ejecuta ese bytecode.',
        'Main.java compiles with javac to Main.class; the JVM executes that bytecode.',
      )}
    >
      <span className="jvm-stage">
        <FileCode2 size={24} />
        <strong>Main.java</strong>
        <small>{t(locale, 'Código fuente', 'Source code')}</small>
      </span>
      <span className="jvm-arrow">
        <small>javac</small>
        <ArrowRight size={20} />
      </span>
      <span className="jvm-stage">
        <Package size={24} />
        <strong>Main.class</strong>
        <small>Bytecode</small>
      </span>
      <span className="jvm-arrow">
        <small>java</small>
        <ArrowRight size={20} />
      </span>
      <span className="jvm-stage">
        <Cpu size={24} />
        <strong>JVM</strong>
        <small>{t(locale, 'Ejecución', 'Execution')}</small>
      </span>
    </span>
  );
}
