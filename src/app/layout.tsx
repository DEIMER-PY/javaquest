import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: { default: 'JavaQuest · Aprende Java, un paso a la vez', template: '%s · JavaQuest' },
  description:
    'Una aventura gratuita para aprender Java desde cero: teoría, playground, proyectos guiados y sesiones diarias.',
  icons: { icon: '/icon.svg' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try { if(localStorage.getItem('javaquest-theme')==='dark') document.documentElement.classList.add('dark'); } catch {}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
