import { useEffect, useState } from "react";

const PASOS = [
  {
    emoji: "👋",
    titulo: "¡Bienvenido/a!",
    texto:
      "Esta app te ayuda a seguir tu avance en la Lic. en Ciencia de Datos de la Siglo 21. Todo se guarda automáticamente en este navegador: no hay cuentas ni contraseñas.",
  },
  {
    emoji: "📚",
    titulo: "Plan de estudios",
    texto:
      "Tocá una materia para cambiar su estado: Pendiente → Cursando → Aprobado → Eximido. Las que tienen borde azul ya están disponibles para cursar. Arriba tenés búsqueda y filtros.",
  },
  {
    emoji: "🗺️",
    titulo: "Mapa de correlativas",
    texto:
      "Tocá una materia en el mapa y vas a ver en rojo lo que necesita y en azul todo lo que habilita. Desde el panel de abajo podés cambiar su estado.",
  },
  {
    emoji: "📊",
    titulo: "Estadísticas",
    texto:
      "Tu % de avance total y por cuatrimestre, qué materias podés cursar ahora mismo, y cuáles están a una sola correlativa de desbloquearse.",
  },
  {
    emoji: "🔗",
    titulo: "Compartí tu avance",
    texto:
      "El botón «Compartir avance» copia un link con tu progreso para mostrárselo a un compañero. También podés exportar/importar un JSON para respaldarlo o cambiar de navegador.",
  },
];

export function Tutorial({ onCerrar }: { onCerrar: () => void }) {
  const [paso, setPaso] = useState(0);
  const ultimo = paso === PASOS.length - 1;
  const { emoji, titulo, texto } = PASOS[paso];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCerrar]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={onCerrar}
      role="dialog"
      aria-modal="true"
      aria-label="Tutorial de la aplicación"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-(--border) bg-(--surface) p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-4xl mb-3" aria-hidden="true">
          {emoji}
        </div>
        <h2 className="text-lg font-bold text-(--ink) mb-2">{titulo}</h2>
        <p className="text-sm text-(--ink-2) leading-relaxed min-h-24">{texto}</p>

        <div className="flex items-center justify-center gap-1.5 my-4" aria-hidden="true">
          {PASOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setPaso(i)}
              className="w-2 h-2 rounded-full transition-colors cursor-pointer"
              style={{
                background: i === paso ? "var(--accent)" : "var(--grid)",
              }}
              tabIndex={-1}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onCerrar}
            className="px-3 py-1.5 text-xs font-medium rounded-lg text-(--ink-muted) hover:text-(--ink) cursor-pointer"
          >
            Saltar
          </button>
          <div className="flex gap-2">
            {paso > 0 && (
              <button
                onClick={() => setPaso(paso - 1)}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-(--border) bg-(--surface) text-(--ink-2) hover:text-(--ink) cursor-pointer"
              >
                Anterior
              </button>
            )}
            <button
              onClick={() => (ultimo ? onCerrar() : setPaso(paso + 1))}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg text-white cursor-pointer"
              style={{ background: "var(--accent)" }}
            >
              {ultimo ? "¡Empezar!" : "Siguiente"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
