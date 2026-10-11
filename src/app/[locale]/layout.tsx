import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { serverClient } from '@/lib/supabase/server';
import { hasSupabase } from '@/lib/supabase/config';
import { LearningProvider } from '@/components/providers';
import { SiteShell } from '@/components/site-shell';
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const client = await serverClient();
  const result = client ? await client.auth.getUser() : null;
  const u = result?.data.user;
  const user = u
    ? {
        id: u.id,
        name: String(
          u.user_metadata.full_name ?? u.user_metadata.name ?? u.email?.split('@')[0] ?? 'Explorer',
        ),
      }
    : null;
  return (
    <LearningProvider
      key={`${locale}:${user?.id ?? 'guest'}`}
      locale={locale}
      user={user}
      configured={hasSupabase()}
    >
      <SiteShell>{children}</SiteShell>
    </LearningProvider>
  );
}
