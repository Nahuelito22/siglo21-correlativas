# Siglo 21 — Correlativas · Lic. en Ciencia de Datos

Web app para seguir el avance de la **Licenciatura en Ciencia de Datos**
(Universidad Siglo 21): marcá tus materias, mirá el mapa de correlativas y
descubrí qué podés cursar. Sin cuentas ni backend — tu avance vive en tu
navegador.

## Funcionalidades

- **Plan de estudios**: las 54 materias por cuatrimestre; clic para ciclar
  Pendiente → Cursando → Aprobado → Eximido. Búsqueda y filtros por estado.
- **Mapa de correlativas**: grafo interactivo; al pasar el mouse sobre una
  materia se resalta en rojo lo que necesita y en azul lo que habilita.
- **Estadísticas**: % de avance total y por cuatrimestre, materias disponibles
  para cursar ahora y las que están a una correlativa de desbloquearse.
- **Compartir**: genera un link con tu avance codificado en la URL para
  mostrárselo a un compañero (se abre en modo solo lectura).
- **Export / import JSON** para respaldar o migrar tu avance entre navegadores.
- Modo claro / oscuro.

## Stack

- [Astro 5](https://astro.build) + islas [React 19](https://react.dev)
- Tailwind CSS 4
- TypeScript
- Persistencia en `localStorage` (sin backend / DB)

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # build de producción en dist/
npm run preview  # sirve el build local
```

## Deploy en Vercel

El sitio es 100% estático, Vercel lo detecta solo:

1. Importá este repo en [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Astro** (auto-detectado). Sin variables de entorno.
3. Deploy — cada push a `main` redeploya.

## Datos

Las 54 materias y sus correlativas están en `src/data/materias.ts`, extraídas
del Excel original (`docs/Materias-Lic-Cs-Datos.xlsx`). Los estados posibles:

- **A** = Aprobado · **E** = Eximido · **C** = Cursando · **P** = Pendiente

Una materia está *disponible* si todas sus correlativas están en `A` o `E`.
