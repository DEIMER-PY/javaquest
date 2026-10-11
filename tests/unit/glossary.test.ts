import { describe, it, expect } from 'vitest';
import { glossary, categories, normalizeSearch } from '../../src/lib/glossary';
import lessons from '../../src/lib/lessons.json';
describe('public glossary', () => {
  it('publishes thirty original bilingual concepts with valid curriculum links', () => {
    expect(glossary).toHaveLength(30);
    expect(new Set(glossary.map((e) => e.id)).size).toBe(30);
    for (const entry of glossary) {
      expect(categories[entry.category]).toBeDefined();
      for (const locale of ['es', 'en'] as const) {
        expect(entry.term[locale].length).toBeGreaterThan(1);
        expect(entry.definition[locale].length).toBeGreaterThan(40);
      }
      expect(entry.example.code.length).toBeGreaterThan(5);
      if (entry.lessonId) expect(lessons.some((l) => l.id === entry.lessonId)).toBe(true);
    }
  });
  it('normalizes accents, case, and whitespace for searches', () => {
    expect(normalizeSearch('  ENCAPSULACIÓN ')).toBe('encapsulacion');
    expect(normalizeSearch('Compilador')).toBe('compilador');
  });
});
