# JavaQuest: sistema visual

## Referencias y decisiones

| Referencia                                                                                                                         | Decisión aplicada                                                     |
| ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [JSCamp](https://www.jscamp.dev/)                                                                                                  | Paleta negro/amarillo, detalles de terminal y temario público.        |
| [Coddy Java](https://coddy.tech/landing/es/java)                                                                                   | Objetivos visibles, temario desplegable y acceso directo a practicar. |
| [CodeGym](https://codegym.cc/es/)                                                                                                  | Código como protagonista y espacio de aprendizaje organizado.         |
| [Exercises Java](https://www.exercisesjava.com/es/)                                                                                | Agrupación por conceptos y proyectos de dificultad progresiva.        |
| [El Blog del Programador](https://elblogdelprogramador.com/posts/tutorial-completo-para-aprender-programacion-en-java-desde-cero/) | Columna de lectura, explicaciones y ejemplos.                         |
| [Figma: dashboards](https://www.figma.com/templates/dashboard-designs/)                                                            | Composición responsive y consistencia entre temas.                    |

La URL española de la galería Figma devolvió HTTP 403 durante la investigación. Se consultó el catálogo público accesible. No se importaron archivos ni se copiaron gráficos de esas plataformas: el monograma JQ, las composiciones, las ilustraciones de código y el glosario son propios.

## Paleta

| Token                 | Oscuro    | Claro     |
| --------------------- | --------- | --------- |
| Fondo                 | `#0B0B0B` | `#FAFAFA` |
| Superficie            | `#141414` | `#FFFFFF` |
| Superficie secundaria | `#1B1B1B` | `#F0F0F2` |
| Texto principal       | `#FCFCFC` | `#171717` |
| Texto secundario      | `#AAAAB3` | `#55555E` |
| Acción principal      | `#FDE047` | `#FDE047` |
| Texto de acción       | `#171717` | `#171717` |
| Enlaces y foco        | `#FDE047` | `#735500` |

El amarillo claro sobre blanco no se usa para texto informativo. Los estados de acierto, error y aviso tienen tokens independientes y etiquetas, además de color. La sintaxis y la consola utilizan los tokens del tema.

El modo oscuro es inicial; una preferencia guardada `light` tiene prioridad. El selector conserva la elección al navegar y recargar, actualiza su nombre accesible y se sincroniza entre pestañas. Un script previo al render aplica tema e idioma para evitar una entrada con colores o idioma incorrectos.

## Tipografía, gráficos y navegación

- Space Grotesk: títulos y marca. Inter: lectura y controles. IBM Plex Mono: código, índices y etiquetas. Las fuentes se alojan en la aplicación y sus licencias OFL se conservan en `public/licenses/`.
- Texto de lectura: 16 px. Controles: al menos 14 px. Etiquetas auxiliares: al menos 12 px. Los botones y controles principales tienen objetivos táctiles de 44 px.
- Los iconos de unidades y proyectos tienen significados diferentes y comparten grosor y alineación. El favicon conserva el monograma JQ sobre amarillo.
- `/{locale}` es una portada pública. `/{locale}/dashboard` es el espacio de aprendizaje. `/{locale}/glossary` ofrece treinta conceptos con búsqueda normalizada, categorías y lecciones relacionadas.
- El temario distingue seis unidades disponibles de las rutas avanzadas planificadas. Los contadores provienen del currículo.
- Los menús móviles usan diálogos nativos con Escape, foco y bloqueo del desplazamiento del fondo.

## Responsive y comprobaciones

Los grids usan columnas `minmax(0, 1fr)` y los paneles permiten contraerse. Se corrigió el desbordamiento confirmado de Herramientas: antes llegaba a 429 px en una pantalla de 360 px. El código largo mantiene desplazamiento horizontal dentro de su panel; el documento no se oculta globalmente para disimular problemas.

La suite visual comprueba doce pantallas en 320, 360, 390, 768, 1024 y 1440 px, en español e inglés y en ambos temas: 288 combinaciones. También comprueba búsqueda, temario, tema persistente, teclado, objetivos táctiles y contraste de tokens WCAG AA.

```bash
npm run typecheck
npm run lint
npm test
npm run build
# Con la app iniciada en otra terminal:
npm run test:e2e
node scripts/capture-design.mjs
```

Las capturas se generan desde la aplicación real. Esta entrega visual no configura OAuth, no aplica migraciones de Supabase y no cambia la protección de Vercel.
