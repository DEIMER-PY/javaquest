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
- 13 pruebas unitarias: aprobadas, incluyendo PostgreSQL real en memoria con PGlite y políticas RLS entre dos usuarios.
- 3 pruebas de navegador en Chrome: aprobadas; lección, persistencia local, idioma, móvil y playground.
- Build de producción: aprobado.
- Auditoría de dependencias de producción: sin vulnerabilidades reportadas. La cadena de desarrollo `eslint-config-next → fast-glob → micromatch → braces` presenta cinco avisos de severidad alta; el paquete afectado no ofrecía versión corregida al revisar. No se aplica un downgrade incompatible de Next.js para ocultar el aviso.
- El esquema de base de datos se prueba con perfiles distintos, rechazo de cambios de propietario, XP exclusivo del servidor y finalizaciones idempotentes. Esto no sustituye la prueba de OAuth ni una prueba sobre el proyecto Supabase definitivo.
- Vercel: proyecto dedicado creado. La revisión automática rechazó cambiar su protección SSO a previews únicamente; publicar producción para toda la clase necesita aprobación de ese ajuste. Un despliegue protegido no equivale a un sitio público.

Las capturas de `docs/images/` se generan desde la aplicación real, no son mockups.
