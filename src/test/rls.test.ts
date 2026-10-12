// @vitest-environment node
// يختبر سياسات الأمان (RLS) الفعلية من ملف الترحيل على Postgres حقيقي (PGlite) مع محاكاة أدوار Supabase.
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { emptyProgress } from '../lib/progress';

const A = '11111111-1111-1111-1111-111111111111';
const B = '22222222-2222-2222-2222-222222222222';
let db: PGlite;

const SHIM = `
create role anon nologin;
create role authenticated nologin;
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
grant usage on schema auth to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
grant usage on schema public to anon, authenticated;
insert into auth.users values ('${A}'), ('${B}');
`;

async function as(role: 'anon' | 'authenticated', uid: string | null, sql: string, params: unknown[] = []) {
  await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${uid ?? ''}', false); set role ${role};`);
  try {
    return await db.query<Record<string, unknown>>(sql, params);
  } finally {
    await db.exec('reset role;');
  }
}

const data = (name: string) => JSON.stringify({ ...emptyProgress(0), profile: { name, gender: 'n', onboarded: true, updatedAt: 1 } });

beforeAll(async () => {
  db = new PGlite();
  await db.exec(SHIM);
  await db.exec(readFileSync(resolve(__dirname, '../../supabase/migrations/0001_init.sql'), 'utf8'));
});

describe('سياسات الوصول لجدول التقدم', () => {
  it('المستخدم يحفظ ويقرأ صفه', async () => {
    await as('authenticated', A, 'insert into public.progress (user_id, data) values ($1, $2)', [A, data('A')]);
    const r = await as('authenticated', A, 'select user_id from public.progress');
    expect(r.rows).toEqual([{ user_id: A }]);
  });

  it('المستخدم لا يرى صف غيره', async () => {
    await as('authenticated', B, 'insert into public.progress (user_id, data) values ($1, $2)', [B, data('B')]);
    const r = await as('authenticated', B, 'select user_id from public.progress');
    expect(r.rows).toEqual([{ user_id: B }]);
  });

  it('لا يمكن إنشاء صف باسم مستخدم آخر', async () => {
    await expect(
      as('authenticated', A, 'insert into public.progress (user_id, data) values ($1, $2)', ['33333333-3333-3333-3333-333333333333', data('X')]),
    ).rejects.toThrow();
  });

  it('لا يمكن تعديل أو حذف صف مستخدم آخر', async () => {
    const u = await as('authenticated', A, 'update public.progress set data = $1 where user_id = $2', [data('hacked'), B]);
    expect(u.affectedRows).toBe(0);
    const d = await as('authenticated', A, 'delete from public.progress where user_id = $1', [B]);
    expect(d.affectedRows).toBe(0);
    const still = await as('authenticated', B, "select data->'profile'->>'name' as name from public.progress");
    expect(still.rows).toEqual([{ name: 'B' }]);
  });

  it('لا يمكن نقل الصف إلى مستخدم آخر بالتعديل', async () => {
    await expect(as('authenticated', A, 'update public.progress set user_id = $1 where user_id = $2', [B, A])).rejects.toThrow();
  });

  it('الزائر غير المسجل ممنوع تمامًا', async () => {
    await expect(as('anon', null, 'select * from public.progress')).rejects.toThrow(/permission denied/);
    await expect(as('anon', null, 'insert into public.progress (user_id, data) values ($1, $2)', [A, data('x')])).rejects.toThrow();
  });

  it('رفض البيانات غير الصالحة', async () => {
    await expect(as('authenticated', A, 'update public.progress set data = $1 where user_id = $2', ['[]', A])).rejects.toThrow();
    await expect(as('authenticated', A, 'update public.progress set data = $1 where user_id = $2', ['{"version": 2}', A])).rejects.toThrow();
  });

  it('وقت التحديث يضبطه الخادم', async () => {
    await as('authenticated', A, "update public.progress set data = $1, updated_at = '2000-01-01' where user_id = $2", [data('A2'), A]);
    const r = await as('authenticated', A, "select updated_at > now() - interval '1 minute' as fresh from public.progress");
    expect(r.rows[0].fresh).toBe(true);
  });

  it('المستخدم يستطيع حذف بياناته', async () => {
    const d = await as('authenticated', B, 'delete from public.progress where user_id = $1', [B]);
    expect(d.affectedRows).toBe(1);
  });
});
