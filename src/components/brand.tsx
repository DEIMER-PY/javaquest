import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className ?? 'brand-mark'} fill="none">
      <rect x="1" y="1" width="46" height="46" rx="11" fill="currentColor" />
      <g
        stroke="var(--primary-foreground)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 13h9v17a5 5 0 0 1-10 0" />
        <path d="M28 14h5a5 5 0 0 1 5 5v11a5 5 0 0 1-5 5h-5a5 5 0 0 1-5-5" />
        <path d="m32 29 7 9" />
      </g>
    </svg>
  );
}
export function Brand({ locale }: { locale: Locale }) {
  return (
    <Link href={`/${locale}`} className="brand" aria-label="JavaQuest">
      <BrandMark />
      <span>
        Java<span className="brand-accent">Quest</span>
        <span className="brand-dot">.</span>
      </span>
    </Link>
  );
}
