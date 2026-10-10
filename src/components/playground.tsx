'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { java } from '@codemirror/lang-java';
import { Download, Play, Plus, RotateCcw, Save, Square, Terminal, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { useLearning } from './providers';
import { t } from '@/lib/i18n';
import lessons from '@/lib/lessons.json';
const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), {
  ssr: false,
  loading: () => <div className="loading">Loading editor…</div>,
});
type File = { name: string; code: string };
const defaults: File[] = [
  {
    name: 'Main.java',
    code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hola, JavaQuest!");\n    }\n}',
  },
];
type Status = 'idle' | 'loading' | 'ready' | 'compiling' | 'running';
export function Playground({ lessonId }: { lessonId?: string }) {
  const { locale, user, setNotice } = useLearning();
  const lesson = lessons.find((l) => l.id === lessonId);
  const [files, setFiles] = useState<File[]>(
    lesson ? [{ name: 'Main.java', code: lesson.example }] : defaults,
  );
  const [active, setActive] = useState(0);
  const [filename, setFilename] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [connected, setConnected] = useState(false);
  const [output, setOutput] = useState('');
  const [saving, setSaving] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const port = useRef<MessagePort | null>(null);
  const pending = useRef<File[] | null>(null);
  const filesRef = useRef(files);
  const [sandbox, setSandbox] = useState('');
  useEffect(() => {
    filesRef.current = files;
  }, [files]);
  useEffect(() => {
    document.documentElement.lang = locale;
    const origin = location.origin;
    // Opaque origin + restricted CSP: the Java worker cannot access app cookies, storage, API routes, or other network hosts.
    const csp = `default-src 'none'; script-src 'unsafe-eval' 'wasm-unsafe-eval' blob: ${origin}/playground/ ${origin}/java-runtime/; connect-src ${origin}/playground/ ${origin}/java-runtime/; worker-src blob:;`;
    const html = `<!doctype html><meta http-equiv="Content-Security-Policy" content="${csp}"><script type="module" src="${origin}/playground/bridge.js"></script>`;
    Promise.resolve().then(() => setSandbox(html));
    return () => {
      port.current?.postMessage({ type: 'stop' });
      port.current?.close();
    };
  }, [locale]);
  useEffect(() => {
    async function restore() {
      if (lesson) return;
      if (user) {
        try {
          const response = await fetch('/api/drafts', { cache: 'no-store' });
          const data = await response.json();
          if (response.ok && Array.isArray(data.files) && data.files.length) setFiles(data.files);
        } catch {}
      } else {
        try {
          const value = JSON.parse(localStorage.getItem('javaquest-draft-v1') ?? 'null');
          if (
            Array.isArray(value) &&
            value.length > 0 &&
            value.length <= 8 &&
            value.every((f) => typeof f.name === 'string' && typeof f.code === 'string')
          )
            setFiles(value);
        } catch {}
      }
    }
    void restore();
  }, [lesson, user]);
  function connect() {
    setConnected(false);
    port.current?.close();
    const channel = new MessageChannel();
    port.current = channel.port1;
    channel.port1.onmessage = ({ data }) => {
      if (data.type === 'connected') {
        setConnected(true);
        return;
      }
      if (data.type === 'ready') {
        setStatus('ready');
        if (pending.current) {
          channel.port1.postMessage({ type: 'compile', files: pending.current });
          pending.current = null;
          setStatus('compiling');
        }
      }
      if (data.type === 'diagnostic')
        setOutput((previous) =>
          (
            previous + `${data.severity}: ${data.file ?? ''}:${data.line ?? ''} ${data.message}\n`
          ).slice(-32768),
        );
      if (data.type === 'running') setStatus('running');
      if (['result', 'runtime-error', 'error', 'compile-error', 'stopped'].includes(data.type)) {
        setStatus(['error', 'stopped'].includes(data.type) ? 'idle' : 'ready');
        setOutput((previous) =>
          [
            previous,
            data.stdout ?? '',
            data.stderr ?? '',
            data.message ? `${data.message}\n` : '',
            data.type === 'compile-error'
              ? t(
                  locale,
                  'Compilación fallida. Revisa los errores.',
                  'Compilation failed. Review the errors.',
                )
              : '',
            data.type === 'stopped' ? t(locale, 'Ejecución detenida.', 'Execution stopped.') : '',
          ]
            .join('')
            .slice(-32768),
        );
      }
    };
    frame.current?.contentWindow?.postMessage({ base: location.origin + '/java-runtime' }, '*', [
      channel.port2,
    ]);
  }
  function run() {
    setOutput('');
    if (status === 'idle') {
      pending.current = filesRef.current;
      setStatus('loading');
      port.current?.postMessage({ type: 'init' });
    } else {
      setStatus('compiling');
      port.current?.postMessage({ type: 'compile', files: filesRef.current });
    }
  }
  function stop() {
    pending.current = null;
    port.current?.postMessage({ type: 'stop' });
  }
  function addFile() {
    if (
      !/^[A-Za-z][A-Za-z0-9]*\.java$/.test(filename) ||
      files.some((f) => f.name === filename) ||
      files.length >= 8
    ) {
      setNotice(
        t(
          locale,
          'Usa un nombre único como Persona.java (máximo 8 archivos).',
          'Use a unique name such as Person.java (maximum 8 files).',
        ),
      );
      return;
    }
    const name = filename.slice(0, -5);
    setFiles([...files, { name: filename, code: `public class ${name} {\n\n}` }]);
    setActive(files.length);
    setFilename('');
  }
  async function save() {
    setSaving(true);
    try {
      if (user) {
        const response = await fetch('/api/drafts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(files),
        });
        if (!response.ok) throw Error();
        setNotice(
          t(locale, 'Borrador sincronizado con tu cuenta.', 'Draft synced to your account.'),
        );
      } else {
        localStorage.setItem('javaquest-draft-v1', JSON.stringify(files));
        setNotice(
          t(locale, 'Borrador guardado en este navegador.', 'Draft saved in this browser.'),
        );
      }
    } catch {
      setNotice(
        t(
          locale,
          'No se pudo guardar. Descarga el archivo para conservarlo.',
          'Could not save. Download the file to keep it.',
        ),
      );
    } finally {
      setSaving(false);
    }
  }
  function download() {
    const f = files[active];
    const url = URL.createObjectURL(new Blob([f.code], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = f.name;
    a.click();
    URL.revokeObjectURL(url);
  }
  const busy = ['loading', 'compiling', 'running'].includes(status);
  const statusText = {
    idle: t(locale, 'Java se carga al ejecutar por primera vez.', 'Java loads on your first run.'),
    loading: t(
      locale,
      'Preparando Java… La primera carga puede tardar.',
      'Preparing Java… First load may take a while.',
    ),
    ready: t(
      locale,
      'Java listo · ejecución local en tu navegador',
      'Java ready · runs locally in your browser',
    ),
    compiling: t(locale, 'Compilando tu código…', 'Compiling your code…'),
    running: t(locale, 'Ejecutando…', 'Running…'),
  };
  return (
    <>
      <div className="page-intro">
        <span className="eyebrow">{t(locale, 'TU LABORATORIO DE IDEAS', 'YOUR IDEAS LAB')}</span>
        <h1>
          Java Playground<span className="text-primary">.</span>
        </h1>
        <p>
          {t(
            locale,
            'Código real. Libertad para equivocarte. Un espacio para descubrir cómo funciona Java.',
            'Real code. Room to make mistakes. A space to discover how Java works.',
          )}
        </p>
      </div>
      <iframe
        ref={frame}
        title="Isolated Java runtime"
        sandbox="allow-scripts"
        srcDoc={sandbox || undefined}
        onLoad={sandbox ? connect : undefined}
        style={{ display: 'none' }}
      />
      <div className="editor-container">
        <div className="editor-toolbar">
          <div className="file-tabs">
            {files.map((file, index) => (
              <button
                key={file.name}
                className={`file-tab ${active === index ? 'active' : ''}`}
                onClick={() => setActive(index)}
              >
                {file.name}
              </button>
            ))}
          </div>
          <div className="editor-actions">
            <Button
              variant="ghost"
              size="icon"
              aria-label={t(locale, 'Restaurar ejemplo', 'Reset example')}
              disabled={busy}
              onClick={() => {
                setFiles(lesson ? [{ name: 'Main.java', code: lesson.example }] : defaults);
                setActive(0);
              }}
            >
              <RotateCcw size={16} />
            </Button>
            <Button size="sm" variant="outline" onClick={save} disabled={saving}>
              <Save size={14} />
              {t(locale, 'Guardar', 'Save')}
            </Button>
            <Button size="sm" onClick={run} disabled={busy || !connected}>
              <Play size={14} />
              {t(locale, 'Ejecutar', 'Run')}
            </Button>
            {busy ? (
              <Button size="sm" variant="outline" onClick={stop}>
                <Square size={13} />
                {t(locale, 'Detener', 'Stop')}
              </Button>
            ) : null}
          </div>
        </div>
        <div className="editor-panels">
          <div className="editor-code">
            <CodeMirror
              value={files[active]?.code ?? ''}
              height="390px"
              extensions={[java()]}
              theme="dark"
              aria-label={t(locale, 'Código Java', 'Java code')}
              onChange={(code) =>
                setFiles((current) =>
                  current.map((f, i) => (i === active ? { ...f, code: code.slice(0, 20000) } : f)),
                )
              }
            />
          </div>
          <div className="editor-output">
            <div className="output-title">
              <span className="flex items-center gap-2">
                <Terminal size={14} />
                {t(locale, 'SALIDA', 'OUTPUT')}
              </span>
              <span>STDOUT / STDERR</span>
            </div>
            <pre aria-live="polite">
              {output ||
                t(
                  locale,
                  'Tu próxima idea empieza con una línea.\nPulsa Ejecutar para ver el resultado.',
                  'Your next idea starts with one line.\nPress Run to see the result.',
                )}
            </pre>
          </div>
        </div>
        <div className="editor-status" role="status">
          <span className="tiny-dot" />
          {statusText[status]}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-4">
        <input
          className="filename-input"
          placeholder="Persona.java"
          aria-label={t(locale, 'Nombre del nuevo archivo', 'New file name')}
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
        />
        <Button size="sm" variant="outline" onClick={addFile}>
          <Plus size={14} />
          {t(locale, 'Añadir archivo', 'Add file')}
        </Button>
        <Button size="sm" variant="outline" onClick={download}>
          <Download size={14} />
          {t(locale, 'Descargar archivo', 'Download file')}
        </Button>
        {active > 0 ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setFiles((current) => current.filter((_, i) => i !== active));
              setActive(0);
            }}
          >
            <Trash2 size={14} />
            {t(locale, 'Eliminar archivo', 'Delete file')}
          </Button>
        ) : null}
      </div>
      <div className="playground-examples">
        {['hello-world', 'for', 'classes', 'lists'].map((id) => {
          const l = lessons.find((x) => x.id === id)!;
          return (
            <Button
              key={id}
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => {
                setFiles([{ name: 'Main.java', code: l.example }]);
                setActive(0);
                setOutput('');
              }}
            >
              {l.title[locale]}
            </Button>
          );
        })}
      </div>
      <p className="playground-note">
        {t(
          locale,
          'Compilación real con javac + TeaVM. Compatible con los fundamentos de esta ruta; no equivale a todas las APIs de un JDK de escritorio. Scanner, archivos del sistema, Spring Boot y MySQL se practican con el JDK local. Ejecución: máximo 5 segundos y 32 KB de salida.',
          'Real compilation with javac + TeaVM. Supports this path’s foundations; it does not provide every desktop JDK API. Practice Scanner, system files, Spring Boot, and MySQL with a local JDK. Execution limit: 5 seconds and 32 KB output.',
        )}
      </p>
    </>
  );
}
