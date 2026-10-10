import { NextResponse } from 'next/server';
import { serverClient } from '@/lib/supabase/server';
export async function authenticated() {
  const client = await serverClient();
  if (!client)
    return {
      response: NextResponse.json({ error: 'Accounts are not configured yet.' }, { status: 503 }),
    };
  const { data, error } = await client.auth.getUser();
  if (error || !data.user)
    return {
      response: NextResponse.json({ error: 'Sign in to save your progress.' }, { status: 401 }),
    };
  return { client, user: data.user };
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}
export function apiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
