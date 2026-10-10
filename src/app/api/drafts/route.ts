import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticated, apiError, sameOrigin } from '@/lib/api';
const files = z
  .array(
    z.object({
      name: z.string().regex(/^[A-Za-z][A-Za-z0-9]*\.java$/),
      code: z.string().max(20000),
    }),
  )
  .min(1)
  .max(8);
export async function GET() {
  const auth = await authenticated();
  if (auth.response) return auth.response;
  const { data, error } = await auth.client
    .from('jq_drafts')
    .select('files')
    .eq('user_id', auth.user.id)
    .maybeSingle();
  if (error) return apiError('Draft unavailable.', 503);
  return NextResponse.json(
    { files: data?.files ?? null },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}
export async function PUT(request: Request) {
  if (!sameOrigin(request)) return apiError('Invalid origin.', 403);
  const auth = await authenticated();
  if (auth.response) return auth.response;
  let parsed;
  try {
    parsed = files.safeParse(await request.json());
  } catch {
    return apiError('Invalid JSON.');
  }
  if (!parsed.success || new Set(parsed.data.map((f) => f.name)).size !== parsed.data.length)
    return apiError('Invalid files.');
  const { error } = await auth.client
    .from('jq_drafts')
    .upsert({ user_id: auth.user.id, files: parsed.data, updated_at: new Date().toISOString() });
  if (error) return apiError('Draft could not be saved.', 503);
  return NextResponse.json({ saved: true });
}
