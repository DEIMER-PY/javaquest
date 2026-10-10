export type Completion = { lesson_id: string; completed_at: string; xp: number };
export function dayKey(date: Date, timezone: string) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
export function streak(dates: string[], today: string) {
  const days = new Set(dates);
  const cursor = new Date(today + 'T12:00:00Z');
  const key = () => cursor.toISOString().slice(0, 10);
  if (!days.has(key())) cursor.setUTCDate(cursor.getUTCDate() - 1);
  let count = 0;
  while (days.has(key())) {
    count++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return count;
}
export function validTimezone(value: string) {
  try {
    new Intl.DateTimeFormat('en', { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}
