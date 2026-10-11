import { Rocket, Code2, Route, Blocks, Box, FolderCheck } from 'lucide-react';
const icons = {
  rocket: Rocket,
  code: Code2,
  route: Route,
  blocks: Blocks,
  box: Box,
  trophy: FolderCheck,
};
export function UnitIcon({ name, size = 24 }: { name: string; size?: number }) {
  const Icon = icons[name as keyof typeof icons] ?? Code2;
  return <Icon size={size} strokeWidth={1.7} aria-hidden="true" />;
}
