'use client';
import { usePathname } from 'next/navigation';
import { useLearning } from './providers';
import { Shell } from './shell';
import { PublicShell } from './public-shell';
export function SiteShell({ children }: { children: React.ReactNode }) {
  const { locale } = useLearning();
  const pathname = usePathname();
  const isPublic = [`/${locale}`, `/${locale}/glossary`, `/${locale}/login`].includes(pathname);
  return isPublic ? <PublicShell>{children}</PublicShell> : <Shell>{children}</Shell>;
}
