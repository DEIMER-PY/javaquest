import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticated, apiError, sameOrigin } from '@/lib/api';
import { validTimezone } from '@/lib/progress';
export async function GET() {
  const auth = await authenticated();
  if (auth.response) return auth.response;
  const { client, user } = auth;
  const results = await Promise.all([
    client
      .from('jq_profiles')
      .select('display_name,timezone,locale')
      .eq('id', user.id)
      .maybeSingle(),
    client.from('jq_completions').select('lesson_id,completed_at,xp').eq('user_id', user.id),
    client
      .from('jq_activity')
      .select('day')
      .eq('user_id', user.id)
      .order('day', { ascending: false })
      .limit(400),
    client.from('jq_project_steps').select('project_id,step').eq('user_id', user.id),
  ]);
  if (results.some((r) => r.error)) return apiError('Progress database is unavailable.', 503);
  return NextResponse.json(
    {
      profile: results[0].data,
      completions: results[1].data,
      activity: results[2].data?.map((x) => x.day),
      projectSteps: results[3].data,
    },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}
export async function PUT(request: Request) {
  if (!sameOrigin(request)) return apiError('Invalid origin.', 403);
  const auth = await authenticated();
  if (auth.response) return auth.response;
  let parsed;
  try {
    parsed = z
      .object({
        display_name: z.string().trim().min(1).max(60),
        timezone: z.string().max(80).refine(validTimezone),
        locale: z.enum(['es', 'en']),
      })
      .safeParse(await request.json());
  } catch {
    return apiError('Invalid JSON.');
  }
  if (!parsed.success) return apiError('Invalid profile.');
  const { error } = await auth.client
    .from('jq_profiles')
    .upsert({ id: auth.user.id, ...parsed.data });
  if (error) return apiError('Profile could not be saved.', 503);
  return NextResponse.json({ saved: true });
}
