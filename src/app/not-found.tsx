import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="error-page">
      <h1>404 · Esta ruta aún no existe</h1>
      <p>This path does not exist yet.</p>
      <Link href="/es" className="text-link">
        Volver a JavaQuest / Back to JavaQuest →
      </Link>
    </main>
  );
}
