import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { beforeAll, afterAll, describe, it, expect } from 'vitest';
const db = new PGlite();
const alice = '11111111-1111-4111-8111-111111111111';
const bob = '22222222-2222-4222-8222-222222222222';
async function asUser(id: string) {
  await db.exec(
    `reset role; set role authenticated; select set_config('request.jwt.claim.sub','${id}',false);`,
  );
}
beforeAll(async () => {
  await db.exec(
    `create role anon; create role authenticated; create role service_role bypassrls; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated; insert into auth.users values('${alice}'),('${bob}');`,
  );
  await db.exec(readFileSync('supabase/schema.sql', 'utf8'));
}, 30000);
afterAll(async () => {
  await db.close();
});
describe('real PostgreSQL schema and RLS', () => {
  it('allows only the owner to create and update a profile', async () => {
    await asUser(alice);
    await db.query('insert into public.jq_profiles(id,display_name) values($1,$2)', [
      alice,
      'Alice',
    ]);
    await expect(
      db.query('insert into public.jq_profiles(id,display_name) values($1,$2)', [bob, 'Bob']),
    ).rejects.toThrow();
    await expect(
      db.query('update public.jq_profiles set id=$1 where id=$2', [bob, alice]),
    ).rejects.toThrow();
    await asUser(bob);
    expect((await db.query('select * from public.jq_profiles')).rows).toHaveLength(0);
  });
  it('records attempts and awards completion only once; incorrect answers earn no activity', async () => {
    await db.exec('reset role; set role service_role;');
    await db.query("select public.jq_record_completion($1,'java-story','2026-10-10',false)", [
      alice,
    ]);
    expect((await db.query('select * from public.jq_activity')).rows).toHaveLength(0);
    await db.query("select public.jq_record_completion($1,'java-story','2026-10-10',true)", [
      alice,
    ]);
    await db.query("select public.jq_record_completion($1,'java-story','2026-10-10',true)", [
      alice,
    ]);
    expect((await db.query('select * from public.jq_completions')).rows).toHaveLength(1);
    expect((await db.query('select * from public.jq_activity')).rows).toHaveLength(1);
    expect((await db.query('select * from public.jq_attempts')).rows).toHaveLength(3);
  });
  it('prevents browser clients from awarding themselves XP or calling the privileged transaction', async () => {
    await asUser(alice);
    await expect(
      db.query("insert into public.jq_completions(user_id,lesson_id) values($1,'for')", [alice]),
    ).rejects.toThrow();
    await expect(
      db.query("select public.jq_record_completion($1,'for','2026-10-10',true)", [alice]),
    ).rejects.toThrow();
    expect((await db.query('select * from public.jq_completions')).rows).toHaveLength(1);
    await asUser(bob);
    expect((await db.query('select * from public.jq_completions')).rows).toHaveLength(0);
  });
  it('isolates drafts and rejects changing their owner', async () => {
    await asUser(alice);
    await db.query("insert into public.jq_drafts(user_id,files) values($1,'[]')", [alice]);
    await expect(
      db.query('update public.jq_drafts set user_id=$1 where user_id=$2', [bob, alice]),
    ).rejects.toThrow();
    await asUser(bob);
    expect((await db.query('select * from public.jq_drafts')).rows).toHaveLength(0);
    await db.exec('reset role; set role anon;');
    await expect(db.query('select * from public.jq_drafts')).rejects.toThrow();
  });
  it('enforces the daily assessment budget without awarding extra progress', async () => {
    await db.exec('reset role; set role service_role;');
    await db.query(
      "insert into public.jq_attempts(user_id,lesson_id,correct) select $1,'for',false from generate_series(1,197)",
      [alice],
    );
    await expect(
      db.query("select public.jq_record_completion($1,'for','2026-10-10',true)", [alice]),
    ).rejects.toThrow('Daily assessment limit reached');
    expect((await db.query('select * from public.jq_completions')).rows).toHaveLength(1);
  });
});
