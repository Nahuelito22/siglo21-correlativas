# Backlog de ideas

Ideas y mejoras pendientes para la app. No es un compromiso — es un lugar donde
anotarlas para no perderlas. Cuando una se implementa, se mueve a "Hechas".

## Pendientes

### Tutorial de bienvenida (onboarding)
Pantalla o recorrido guiado para quien entra por primera vez, explicando qué
hace cada apartado: cómo marcar estados en el **Plan de estudios**, cómo leer el
**Mapa de correlativas** (rojo = necesita, azul = habilita) y qué muestra
**Estadísticas**. Se muestra una sola vez (flag en `localStorage`, ej.
`siglo21-tutorial-visto`) con opción de saltarlo y de volver a verlo desde un
botón de ayuda «?» en el header. Posibles formatos: modal con pasos, o tooltips
anclados a cada pestaña (coach marks).

### Nombres reales de las Electivas
Hoy figuran como "Electiva 1/2" porque así están en el Excel. Si la universidad
publica el catálogo de electivas, permitir elegir cuál cursó cada uno.

### Otras carreras
El modelo de datos lo soporta: un archivo de materias por carrera y un selector.
Tiene sentido solo si compañeros de otras carreras lo piden.

## Hechas

- ✅ Reescritura Astro 5 + islas React 19 + Tailwind 4 (jul 2026)
- ✅ Plan de estudios con búsqueda y filtros
- ✅ Mapa de correlativas interactivo, usable en celular (selección + panel)
- ✅ Estadísticas: avance total/por cuatrimestre, disponibles, por desbloquear
- ✅ Link compartible con avance en la URL (modo solo lectura)
- ✅ Export/import JSON, modo oscuro, persistencia en localStorage
- ✅ Open Graph (vista previa al compartir en chats)
- ✅ PWA: instalable y offline tras la primera visita
