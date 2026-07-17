import { useEffect, useMemo, useState } from "react";
import { leyendaEstados, type Estados, type EstadoMateria } from "@/data/materias";
import { useEstados } from "@/lib/useEstados";
import { calcularAvance } from "@/lib/correlativas";
import { leerCompartido, limpiarParamCompartido } from "@/lib/share";
import { PlanView } from "./PlanView";
import { MapaView } from "./MapaView";
import { StatsView } from "./StatsView";
import { Toolbar } from "./Toolbar";

type Tab = "plan" | "mapa" | "stats";

const TABS: { id: Tab; label: string }[] = [
  { id: "plan", label: "Plan de estudios" },
  { id: "mapa", label: "Mapa de correlativas" },
  { id: "stats", label: "Estadísticas" },
];

const colorEstado: Record<EstadoMateria, string> = {
  A: "var(--c-a)",
  E: "var(--c-e)",
  C: "var(--c-c)",
  P: "var(--c-p)",
};

export default function App() {
  const { estados, loaded, toggleEstado, setEstado, setEstadosImport, resetEstados } =
    useEstados();
  const [tab, setTab] = useState<Tab>("plan");
  const [dark, setDark] = useState(false);
  const [compartido, setCompartido] = useState<Estados | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setCompartido(leerCompartido());
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("siglo21-dark", String(next));
  };

  const modoCompartido = compartido !== null;
  const estadosVista = compartido ?? estados;
  const avance = useMemo(() => calcularAvance(estadosVista), [estadosVista]);

  const usarCompartido = () => {
    if (
      confirm(
        "Esto reemplaza tu avance guardado por el del link compartido. ¿Continuar?"
      )
    ) {
      setEstadosImport(compartido!);
      setCompartido(null);
      limpiarParamCompartido();
    }
  };

  const verElMio = () => {
    setCompartido(null);
    limpiarParamCompartido();
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-(--ink)">
            Lic. en Ciencia de Datos
          </h1>
          <p className="text-sm text-(--ink-2)">
            Universidad Siglo 21 — Avance de carrera y correlativas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-lg font-bold leading-none text-(--ink)">
              {avance.porcentaje}%
            </div>
            <div className="text-[11px] text-(--ink-muted)">
              {avance.aprobadas}/{avance.total} aprobadas
            </div>
          </div>
          <button
            onClick={toggleDark}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-(--border) bg-(--surface) text-(--ink-2) hover:text-(--ink) transition-colors cursor-pointer"
            title="Cambiar tema"
          >
            {dark ? "☀️ Claro" : "🌙 Oscuro"}
          </button>
        </div>
      </header>

      {modoCompartido && (
        <div
          className="rounded-xl border px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
          style={{ borderColor: "var(--accent)", background: "var(--accent-soft)" }}
        >
          <div className="text-sm text-(--ink)">
            <span className="font-semibold">Estás viendo un avance compartido</span>{" "}
            <span className="text-(--ink-2)">
              (solo lectura — tu progreso no se toca).
            </span>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={usarCompartido}
              className="px-3 py-1.5 text-xs font-medium rounded-lg text-white cursor-pointer"
              style={{ background: "var(--accent)" }}
            >
              Usar como mi avance
            </button>
            <button
              onClick={verElMio}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-(--border) bg-(--surface) text-(--ink-2) hover:text-(--ink) cursor-pointer"
            >
              Ver el mío
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <nav
          className="flex rounded-xl border border-(--border) bg-(--surface) p-1 w-fit"
          aria-label="Vistas"
        >
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={[
                "px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer",
                tab === id ? "text-white" : "text-(--ink-2) hover:text-(--ink)",
              ].join(" ")}
              style={tab === id ? { background: "var(--accent)" } : undefined}
              aria-current={tab === id ? "page" : undefined}
            >
              {label}
            </button>
          ))}
        </nav>
        {!modoCompartido && (
          <Toolbar
            estados={estados}
            onImport={setEstadosImport}
            onReset={resetEstados}
          />
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {(Object.keys(leyendaEstados) as EstadoMateria[]).map((sigla) => (
          <div key={sigla} className="flex items-center gap-1.5">
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white"
              style={{ background: colorEstado[sigla] }}
            >
              {sigla}
            </span>
            <span className="text-xs text-(--ink-muted)">
              {leyendaEstados[sigla]}
            </span>
          </div>
        ))}
      </div>

      {tab === "plan" && (
        <PlanView
          estados={estadosVista}
          onToggle={toggleEstado}
          readOnly={modoCompartido}
        />
      )}
      {tab === "mapa" && (
        <MapaView
          estados={estadosVista}
          onSetEstado={setEstado}
          readOnly={modoCompartido}
        />
      )}
      {tab === "stats" && <StatsView estados={estadosVista} />}

      <footer className="text-center text-xs text-(--ink-muted) pt-8 pb-4 border-t border-(--grid)">
        Hecho para la comunidad de Ciencia de Datos · Universidad Siglo 21 · Tu
        avance se guarda en este navegador.
      </footer>
    </div>
  );
}
