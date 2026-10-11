import { Calculator, Dices, ListChecks } from 'lucide-react';
export function ProjectIcon({ id, size = 25 }: { id: string; size?: number }) {
  const Icon = id === 'calculator' ? Calculator : id === 'guess-number' ? Dices : ListChecks;
  return <Icon size={size} strokeWidth={1.7} aria-hidden="true" />;
}
