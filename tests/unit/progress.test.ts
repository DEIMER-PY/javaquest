import { describe, it, expect } from 'vitest';
import { dayKey, streak, validTimezone } from '../../src/lib/progress';
describe('daily progress', () => {
  it('preserves a streak yesterday before today is earned', () =>
    expect(streak(['2026-10-08', '2026-10-09'], '2026-10-10')).toBe(2));
  it('breaks after a missed day', () => expect(streak(['2026-10-08'], '2026-10-10')).toBe(0));
  it('counts consecutive days across year boundaries and ignores duplicates', () =>
    expect(streak(['2025-12-30', '2025-12-31', '2026-01-01', '2026-01-01'], '2026-01-01')).toBe(3));
  it('handles leap days', () =>
    expect(streak(['2024-02-28', '2024-02-29', '2024-03-01'], '2024-03-01')).toBe(3));
  it('uses the learner timezone, not the server day', () =>
    expect(dayKey(new Date('2026-10-11T02:00:00Z'), 'America/Bogota')).toBe('2026-10-10'));
  it('uses calendar dates across daylight saving changes', () =>
    expect(streak(['2026-03-07', '2026-03-08', '2026-03-09'], '2026-03-09')).toBe(3));
  it('rejects invalid timezones', () => {
    expect(validTimezone('invalid/zone')).toBe(false);
    expect(validTimezone('America/Bogota')).toBe(true);
  });
});
