# Instalación y servicios

## Aplicación web

1. Instala Node.js 22 LTS o superior desde https://nodejs.org/ y Git desde https://git-scm.com/downloads.
2. Verifica `node --version`, `npm --version` y `git --version` en una terminal nueva.
3. Clona el repositorio y ejecuta `npm ci`, `npm run java:prepare`, `npm run dev`.
4. En Windows PowerShell usa `npm.cmd` y `npx.cmd` si la política local bloquea los scripts `.ps1`.
5. Abre http://localhost:3000. Java no es una dependencia del servidor web.

## Java local para el alumno

Usa Temurin JDK 21: https://adoptium.net/temurin/releases/?version=21. La sección Herramientas de la app ofrece instrucciones para Windows, macOS y Linux. Instala VS Code con Extension Pack for Java o IntelliJ IDEA con sus funciones gratuitas. Verifica `java --version` y `javac --version`.

## Supabase gratuito

1. Utiliza una organización Free con un espacio de proyecto disponible. No actualices a Pro para completar esta instalación.
2. Crea un proyecto dedicado a JavaQuest. Si eliges compartir un proyecto existente, revisa primero su esquema y conserva todas sus tablas y proveedores de autenticación.
3. Ejecuta la migración inicial en el proyecto seleccionado. El esquema usa el prefijo `jq_` y RLS en todas las tablas.
4. En Settings > API Keys copia URL y clave **publishable** a `.env.local`. La clave **secret** queda en `SUPABASE_SECRET_KEY`, nunca en una variable `NEXT_PUBLIC_`.
5. Habilita Google y GitHub en Authentication > Providers. Cada proveedor necesita una aplicación OAuth propia; GitHub CLI no configura automáticamente el login de estudiantes.
6. Configura Site URL y Redirect URLs: `http://localhost:3000/auth/callback` y `https://TU-DOMINIO/auth/callback`. Permite el parámetro de idioma según la configuración de URLs de Supabase.
7. En cada proveedor usa como callback la URL que muestra Supabase, normalmente `https://PROJECT_REF.supabase.co/auth/v1/callback`. No confundas ese callback con el callback de Next.js.
8. Inicia sesión y guarda tu perfil. Completa una evaluación; comprueba que `jq_completions` y `jq_activity` contienen una sola entrada al repetirla.
9. Verifica con dos cuentas que cada una ve únicamente sus datos. Ejecuta los asesores de seguridad del proyecto antes de compartir.

La sincronización de completaciones necesita tanto la configuración publicable como la clave privada del servidor. No adjuntes `.env.local` a incidencias ni capturas.

## Vercel Hobby

Importa `DEIMER-PY/javaquest` en tu espacio Hobby. Framework: Next.js; raíz: repositorio; build: `npm run build`. El build descarga el compilador y verifica sus hashes. Configura las variables de Supabase en el entorno adecuado y publica. Agrega la URL definitiva a los callbacks de Supabase.

Si no has conectado Supabase, puedes publicar contenido y playground; la pantalla de login informa que las cuentas aún no están habilitadas. No lo describas como sincronización lista hasta comprobar OAuth y RLS.

## Problemas frecuentes

- `javac` no existe: instala el JDK, verifica PATH y abre otra terminal.
- El playground no carga: revisa conectividad, compatibilidad WebAssembly GC y disponibilidad de recursos; prueba un navegador actualizado.
- Compilación inválida: el archivo público y la clase deben tener el mismo nombre.
- Scanner no compila en el playground: usa el JDK local; es una limitación conocida de la biblioteca WebAssembly.
- OAuth falla: revisa ambos callbacks y el proveedor habilitado, no cambies la URL de un proyecto ajeno.
- Progreso no se guarda: revisa la migración, RLS y la variable privada del servidor; las cuentas por sí solas no crean tablas.
