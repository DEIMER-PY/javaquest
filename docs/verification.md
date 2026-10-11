# Estado de verificación

Este documento se actualiza con los resultados reales de cada entrega. Un build correcto no prueba OAuth ni acceso privado a una base de datos.

## Comprobaciones reproducibles

```bash
npm run typecheck
npm run lint
npm test
node scripts/verify-java.mjs
npm run build
npm run dev
# En una segunda terminal
npm run test:e2e
```

El conjunto de navegador comprueba traducción, finalización de lección, persistencia local, menú móvil, compilación real, errores, múltiples archivos y detención. Las pruebas de progreso cubren medianoche en Bogotá, cambio de año, año bisiesto y días perdidos.

## Integraciones externas

- Supabase: pendiente de ubicación gratuita disponible, variables y proveedores OAuth. No se han modificado los dos proyectos existentes.
- Google/GitHub login: requiere las aplicaciones OAuth y una prueba real de inicio de sesión.
- Sincronización entre dispositivos y RLS: pendiente de una base conectada y pruebas con dos usuarios.
- Compilación Java nativa de los proyectos Scanner: requiere un JDK local; los ejemplos compatibles sí se comprueban con WebAssembly.

## Resultados de la primera entrega

- TypeScript y ESLint: sin errores.
- 14 pruebas unitarias aprobadas: contenido, progreso y PostgreSQL real en memoria con PGlite, incluyendo RLS entre dos usuarios y límite de evaluaciones.
- 3 pruebas de navegador en Chrome: aprobadas tanto en desarrollo como en el build de producción local; lección, persistencia local, idioma, móvil y playground, con cancelación durante el arranque y reintento.
- Build de producción: aprobado.
- 60 ejemplos y soluciones del currículo: compilados y ejecutados con javac + TeaVM, además de cinco escenarios de salida esperada.
- GitHub Actions: primera ejecución completa aprobada, incluida instalación desde cero, build y navegador Chromium.
- Despliegue de Vercel: estado READY, alias `https://javaquest-gamma.vercel.app`; conserva autenticación de Vercel.
- Auditoría de dependencias de producción: sin vulnerabilidades reportadas. La cadena de desarrollo `eslint-config-next → fast-glob → micromatch → braces` presenta cinco avisos de severidad alta; el paquete afectado no ofrecía versión corregida al revisar. No se aplica un downgrade incompatible de Next.js para ocultar el aviso.
- El esquema de base de datos se prueba con perfiles distintos, rechazo de cambios de propietario, XP exclusivo del servidor y finalizaciones idempotentes. Esto no sustituye la prueba de OAuth ni una prueba sobre el proyecto Supabase definitivo.
- Vercel: proyecto dedicado creado. La revisión automática rechazó cambiar su protección SSO a previews únicamente; publicar producción para toda la clase necesita aprobación de ese ajuste. Un despliegue protegido no equivale a un sitio público.

Las capturas de `docs/images/` se generan desde la aplicación real, no son mockups.

## Rediseño negro/amarillo

- Nueva portada pública y glosario bilingüe de treinta conceptos. El panel pasa a `/{locale}/dashboard`.
- TypeScript, ESLint y build de producción: aprobados.
- 16 pruebas unitarias: aprobadas, incluyendo cobertura del glosario y sus enlaces al contenido disponible.
- 10 pruebas de navegador aprobadas: contraste de tokens en ambos temas, recorrido público, teclado, tema persistente, regresión de aprendizaje y cuatro matrices de 72 combinaciones cada una. Las doce pantallas caben en los seis tamaños probados, desde 320 hasta 1440 px, en ambos idiomas y temas.
- Los botones principales cumplen 44 px de altura. Los bloques de código largos conservan su desplazamiento interno.
- El recorrido de aprendizaje y la ejecución Java con errores, múltiples archivos y cancelación permanecen verificados.
- La pantalla Herramientas dejó de provocar el desbordamiento de 429 px observado en una ventana de 360 px.
- OAuth, Supabase conectado y la apertura pública de Vercel quedan para la etapa siguiente. Esta entrega conserva las protecciones existentes.

Consulta [el sistema visual y sus referencias](design-system.md). `node scripts/capture-design.mjs` genera capturas reales de portada, glosario, panel, lección, playground y herramientas en claro y oscuro.
