import type { Metadata } from 'next';
import './globals.css';
import '@fontsource-variable/inter';
import '@fontsource-variable/space-grotesk';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import { ThemeProvider } from '@/components/theme';
export const metadata: Metadata = {
  title: { default: 'JavaQuest · Aprende Java, un paso a la vez', template: '%s · JavaQuest' },
  description:
    'Una aventura gratuita para aprender Java desde cero: teoría, playground, proyectos guiados y sesiones diarias.',
  icons: { icon: '/icon.svg' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.lang = location.pathname.split('/')[1] === 'en' ? 'en' : 'es'; try { document.documentElement.classList.toggle('dark', localStorage.getItem('javaquest-theme') !== 'light'); } catch {}`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
