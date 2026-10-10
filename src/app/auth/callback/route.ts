import { NextResponse } from 'next/server';
import { serverClient } from '@/lib/supabase/server';
export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.searchParams.get('locale') === 'en' ? 'en' : 'es';
  const code = url.searchParams.get('code');
  const client = await serverClient();
  if (code && client) {
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(`/${locale}`, url.origin));
  }
  return NextResponse.redirect(new URL(`/${locale}/login?error=oauth`, url.origin));
}
