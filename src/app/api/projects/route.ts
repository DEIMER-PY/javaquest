import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticated, apiError, sameOrigin } from '@/lib/api';
import { projects } from '@/lib/projects';
export async function PUT(request: Request) {
  if (!sameOrigin(request)) return apiError('Invalid origin.', 403);
  const auth = await authenticated();
  if (auth.response) return auth.response;
  let parsed;
  try {
    parsed = z
      .object({ projectId: z.string(), step: z.number().int().min(0), checked: z.boolean() })
      .safeParse(await request.json());
  } catch {
    return apiError('Invalid JSON.');
  }
  if (!parsed.success) return apiError('Invalid step.');
  const { projectId, step, checked } = parsed.data;
  const project = projects.find((x) => x.id === projectId);
  if (!project || step >= project.steps.length) return apiError('Invalid step.');
  const query = checked
    ? auth.client
        .from('jq_project_steps')
        .upsert(
          { user_id: auth.user.id, project_id: projectId, step },
          { onConflict: 'user_id,project_id,step' },
        )
    : auth.client
        .from('jq_project_steps')
        .delete()
        .eq('user_id', auth.user.id)
        .eq('project_id', projectId)
        .eq('step', step);
  const { error } = await query;
  if (error) return apiError('Step could not be saved.', 503);
  return NextResponse.json({ saved: true });
}
