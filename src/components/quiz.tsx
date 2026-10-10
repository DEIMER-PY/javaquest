'use client';
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { Lesson } from '@/lib/course';
import { t } from '@/lib/i18n';
import { Button } from './ui/button';
import { useLearning } from './providers';
export function Quiz({ lesson }: { lesson: Lesson }) {
  const { locale, recordLocal, refresh } = useLearning();
  const [answer, setAnswer] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ correct: boolean; saved: boolean } | null>(null);
  const [error, setError] = useState('');
  async function submit() {
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson.id, answer }),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      setResult(data);
      if (data.correct) {
        if (data.saved) await refresh();
        else recordLocal(lesson.id);
      }
    } catch {
      setError(
        t(locale, 'No se pudo evaluar. Intenta de nuevo.', 'Assessment unavailable. Please retry.'),
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="quiz card">
      <span className="eyebrow">
        {t(locale, 'COMPRUEBA LO QUE APRENDISTE', 'CHECK WHAT YOU LEARNED')}
      </span>
      <h3 className="mt-3">{lesson.question[locale]}</h3>
      <div className="quiz-options">
        {lesson.choices.map((choice, index) => (
          <button
            key={index}
            className={`quiz-option ${answer === index ? 'selected' : ''}`}
            aria-pressed={answer === index}
            onClick={() => {
              setAnswer(index);
              setResult(null);
            }}
          >
            <span>{String.fromCharCode(65 + index)}</span>
            {choice[locale]}
          </button>
        ))}
      </div>
      <Button onClick={submit} disabled={answer === null || busy}>
        {busy
          ? t(locale, 'Evaluando…', 'Checking…')
          : t(locale, 'Comprobar respuesta', 'Check answer')}
        <CheckCircle2 size={16} />
      </Button>
      {result ? (
        <div role="status" className={`quiz-result ${result.correct ? '' : 'wrong'}`}>
          {result.correct
            ? t(locale, '¡Bien hecho! Lección superada.', 'Well done! Lesson completed.')
            : t(
                locale,
                'Todavía no. Revisa la explicación y vuelve a intentarlo.',
                'Not yet. Review the explanation and try again.',
              )}
          {result.correct ? (
            <p className="mt-2 text-xs">
              {result.saved
                ? t(
                    locale,
                    'Tu progreso está sincronizado. Repetir no duplica XP.',
                    'Your progress is synced. Repeating does not duplicate XP.',
                  )
                : t(
                    locale,
                    'Guardado solo en este navegador. Inicia sesión para sincronizar.',
                    'Saved only in this browser. Sign in to sync.',
                  )}
            </p>
          ) : null}
        </div>
      ) : null}
      {error ? (
        <p role="alert" className="mt-4">
          {error}
        </p>
      ) : null}
    </section>
  );
}
