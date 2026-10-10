import { readFileSync, existsSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import lessons from '../../src/lib/lessons.json';
import { projects } from '../../src/lib/projects';
describe('published curriculum', () => {
  it('has thirty unique complete bilingual lessons', () => {
    expect(lessons).toHaveLength(30);
    expect(new Set(lessons.map((l) => l.id)).size).toBe(30);
    for (const lesson of lessons)
      for (const locale of ['es', 'en'] as const) {
        const file = `content/${locale}/${lesson.id}.mdx`;
        expect(existsSync(file)).toBe(true);
        const source = readFileSync(file, 'utf8');
        expect(source).toContain('```java');
        expect(source).toContain(locale === 'es' ? '## Tu misión' : '## Your mission');
        expect(source).toContain(lesson.exercise[locale]);
        expect(lesson.title[locale].length).toBeGreaterThan(3);
        expect(lesson.choices).toHaveLength(3);
      }
  });
  it('has five lessons in each unit and valid project references', () => {
    for (let unit = 1; unit <= 6; unit++)
      expect(lessons.filter((l) => l.unit === unit)).toHaveLength(5);
    for (const p of projects) expect(lessons.some((l) => l.id === p.lesson)).toBe(true);
  });
});
