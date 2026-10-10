import { Playground } from '@/components/playground';
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ lesson?: string }>;
}) {
  const { lesson } = await searchParams;
  return <Playground lessonId={lesson} />;
}
