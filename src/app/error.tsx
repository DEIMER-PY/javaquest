'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="error-page">
      <h1>No se pudo cargar esta página</h1>
      <p>We could not load this page. Please try again.</p>
      <button onClick={reset} className="text-link">
        Reintentar / Retry
      </button>
    </main>
  );
}
