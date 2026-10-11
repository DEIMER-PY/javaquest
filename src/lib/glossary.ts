import type { Localized } from './course';
import entries from './glossary.json';
export type GlossaryCategory = 'basics' | 'language' | 'oop' | 'backend' | 'data' | 'tooling';
export type GlossaryEntry = {
  id: string;
  term: Localized;
  definition: Localized;
  category: GlossaryCategory;
  example: { code: string; language: string };
  lessonId?: string;
};
export const glossary = entries as GlossaryEntry[];
export const categories: Record<GlossaryCategory, Localized> = {
  basics: { es: 'Fundamentos', en: 'Foundations' },
  language: { es: 'Lenguaje', en: 'Language' },
  oop: { es: 'Objetos', en: 'Objects' },
  backend: { es: 'Backend y APIs', en: 'Backend & APIs' },
  data: { es: 'Datos y ORM', en: 'Data & ORM' },
  tooling: { es: 'Herramientas', en: 'Tools' },
};
export function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}
