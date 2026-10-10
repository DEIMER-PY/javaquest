'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useLearning } from './providers';
import { t } from '@/lib/i18n';
export function CodeCopy({ code }: { code: string }) {
  const { locale } = useLearning();
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}{' '}
      {copied ? t(locale, 'Copiado', 'Copied') : t(locale, 'Copiar código', 'Copy code')}
    </Button>
  );
}
