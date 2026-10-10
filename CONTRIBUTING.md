# Contribuir a JavaQuest

Instala con `npm ci` y prepara Java con `npm run java:prepare`. Usa una rama por cambio. Nunca subas `.env.local`, credenciales, sesiones ni datos de alumnos.

## Commits

Conventional Commits, con emoji en el mensaje:

```text
feat(lessons): ✨ add array exercises
fix(playground): 🐛 stop runaway execution
docs: 📝 explain local installation
test(progress): ✅ cover timezone boundaries
chore(deps): 📦 update reviewed dependencies
```

Mantén los cambios relacionados juntos. El prefijo debe ir primero para que las herramientas reconozcan el tipo.

## Contenido

Conserva IDs de lección. Publica español e inglés juntos y comprueba el ejemplo. Cada lección necesita objetivo, explicación, ejercicio, pista, solución y evaluación. Indica qué código requiere JDK local. Añade fuentes y respeta licencias.

## Antes de enviar

Ejecuta tipos, lint, pruebas y build. Si cambias el playground, ejecuta las pruebas de navegador. Si modificas auth o RLS, prueba dos cuentas con datos distintos y confirma que no pueden acceder a datos ajenos. Documenta cualquier integración que no pudiste verificar.
