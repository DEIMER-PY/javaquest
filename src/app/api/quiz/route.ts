import { NextResponse } from 'next/server';
import { z } from 'zod';
import { answers } from '@/lib/grading';
import lessons from '@/lib/lessons.json';
import { authenticated, apiError, sameOrigin } from '@/lib/api';
import { adminClient } from '@/lib/supabase/admin';
import { dayKey } from '@/lib/progress';
export async function POST(request: Request) {
  if (!sameOrigin(request)) return apiError('Invalid origin.', 403);
  let parsed;
  try {
    parsed = z
      .object({ lessonId: z.string(), answer: z.number().int().min(0).max(2) })
      .safeParse(await request.json());
  } catch {
    return apiError('Invalid JSON.');
  }
  if (!parsed.success || !lessons.some((l) => l.id === parsed.data.lessonId))
    return apiError('Invalid lesson or answer.');
  const correct = answers[parsed.data.lessonId] === parsed.data.answer;
  const auth = await authenticated();
  if (auth.response) {
    if (auth.response.status === 401 || auth.response.status === 503)
      return NextResponse.json({ correct, saved: false });
    return auth.response;
  }
  try {
    const admin = adminClient();
    const { data: profile, error: profileError } = await auth.client
      .from('jq_profiles')
      .select('timezone')
      .eq('id', auth.user.id)
      .maybeSingle();
    if (profileError) return apiError('Progress could not be saved.', 503);
    const { error } = await admin.rpc('jq_record_completion', {
      p_user_id: auth.user.id,
      p_lesson_id: parsed.data.lessonId,
      p_day: dayKey(new Date(), profile?.timezone ?? 'America/Bogota'),
      p_correct: correct,
    });
    if (error)
      return apiError(
        error.code === 'P0001' ? 'Daily assessment limit reached.' : 'Progress could not be saved.',
        error.code === 'P0001' ? 429 : 503,
      );
    return NextResponse.json({ correct, saved: correct });
  } catch {
    return apiError('Progress storage is not configured.', 503);
  }
}
