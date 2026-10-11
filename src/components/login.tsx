'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { GitBranch, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { BrandMark } from './brand';
import { useLearning } from './providers';
import { t } from '@/lib/i18n';
import { browserClient } from '@/lib/supabase/client';
function LoginForm() {
  const { locale, configured, user } = useLearning();
  const params = useSearchParams();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function signIn(provider: 'google' | 'github') {
    setBusy(true);
    setError('');
    try {
      const { error } = await browserClient().auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${location.origin}/auth/callback?locale=${locale}` },
      });
      if (error) throw error;
    } catch {
      setError(
        t(
          locale,
          'No se pudo iniciar sesión. Verifica la configuración del proveedor.',
          'Could not sign in. Check the provider configuration.',
        ),
      );
      setBusy(false);
    }
  }
  return (
    <section className="login-card card">
      <BrandMark />
      <span className="eyebrow justify-center">
        {t(locale, 'TU AVENTURA, EN CUALQUIER LUGAR', 'YOUR ADVENTURE, ANYWHERE')}
      </span>
      <h1 className="mt-3">
        {t(locale, 'Aprendamos algo increíble.', 'Let’s learn something incredible.')}
      </h1>
      <p>
        {t(
          locale,
          'Guarda tu progreso, mantén tu racha y continúa desde tu teléfono o computadora.',
          'Save your progress, keep your streak, and continue on your phone or computer.',
        )}
      </p>
      {user ? (
        <Button asChild>
          <Link href={`/${locale}/dashboard`}>
            {t(locale, 'Volver a mi aventura', 'Back to my adventure')}
            <ArrowRight size={16} />
          </Link>
        </Button>
      ) : (
        <div className="login-buttons">
          <Button variant="outline" onClick={() => signIn('google')} disabled={!configured || busy}>
            <span className="font-bold text-lg">G</span>
            {t(locale, 'Continuar con Google', 'Continue with Google')}
          </Button>
          <Button variant="outline" onClick={() => signIn('github')} disabled={!configured || busy}>
            <GitBranch size={19} />
            {t(locale, 'Continuar con GitHub', 'Continue with GitHub')}
          </Button>
        </div>
      )}
      {!configured ? (
        <div className="notice mt-5 text-left" role="status">
          {t(
            locale,
            'Las cuentas aún no están conectadas. Puedes explorar las lecciones y practicar gratis; tus borradores se guardan localmente.',
            'Accounts are not connected yet. Explore lessons and practice for free; drafts are saved locally.',
          )}
        </div>
      ) : null}
      {error || params.get('error') ? (
        <p role="alert">
          {error ||
            t(
              locale,
              'La autenticación no se completó. Vuelve a intentarlo.',
              'Authentication did not complete. Please retry.',
            )}
        </p>
      ) : null}
      <p className="login-footnote">
        {t(
          locale,
          'Sin pagos. Sin suscripciones. Solo ganas de aprender.',
          'No payments. No subscriptions. Just a desire to learn.',
        )}
      </p>
      <Link href={`/${locale}/learn`} className="text-link mt-5">
        {t(locale, 'Explorar sin cuenta', 'Explore without an account')}
        <ArrowRight size={14} />
      </Link>
    </section>
  );
}
export function Login() {
  return (
    <Suspense fallback={<div className="loading">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
