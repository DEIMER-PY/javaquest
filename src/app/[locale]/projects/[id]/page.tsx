import { notFound } from 'next/navigation';
import { projects } from '@/lib/projects';
import { ProjectGuide } from '@/components/projects';
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();
  return <ProjectGuide project={project} />;
}
