import { useMemo, useState } from "react";
import {
  materias,
  cuatrimestresOrdenados,
  nombreCuatrimestre,
  leyendaEstados,
  type Estados,
  type EstadoMateria,
} from "@/data/materias";
import { materiaDisponible, avancePorCuatrimestre } from "@/lib/correlativas";
import { MateriaCard } from "./MateriaCard";

type Filtro = "todas" | "disponibles" | EstadoMateria;

const FILTROS: { valor: Filtro; label: string }[] = [
  { valor: "todas", label: "Todas" },
  { valor: "disponibles", label: "Disponibles" },
  { valor: "C", label: "Cursando" },
  { valor: "P", label: "Pendientes" },
  { valor: "A", label: "Aprobadas" },
  { valor: "E", label: "Eximidas" },
];

function normalizar(s: string): string {
  // Quita diacríticos (U+0300–U+036F tras NFD) para que "algebra" encuentre "Álgebra".
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function PlanView({
  estados,
  onToggle,
  readOnly,
}: {
  estados: Estados;
  onToggle: (id: string) => void;
  readOnly: boolean;
}) {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todas");

  const visibles = useMemo(() => {
    const q = normalizar(busqueda.trim());
    return materias.filter((m) => {
      if (q && !normalizar(m.nombre).includes(q)) return false;
      const estado = estados[m.id] ?? "P";
      if (filtro === "todas") return true;
      if (filtro === "disponibles")
        return estado === "P" && materiaDisponible(m, estados);
      return estado === filtro;
    });
  }, [busqueda, filtro, estados]);

  const idsVisibles = new Set(visibles.map((m) => m.id));
  const hayFiltro = busqueda.trim() !== "" || filtro !== "todas";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar materia…"
          className="w-full sm:w-64 px-3 py-2 text-sm rounded-lg border border-(--border) bg-(--surface) text-(--ink) placeholder:text-(--ink-muted) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
        />
        <div className="flex flex-wrap gap-1.5">
          {FILTROS.map(({ valor, label }) => (
            <button
              key={valor}
              onClick={() => setFiltro(valor)}
              className={[
                "px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer",
                filtro === valor
                  ? "border-(--accent) text-white"
                  : "border-(--border) bg-(--surface) text-(--ink-2) hover:text-(--ink)",
              ].join(" ")}
              style={filtro === valor ? { background: "var(--accent)" } : undefined}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {visibles.length === 0 && (
        <p className="text-sm text-(--ink-muted) py-8 text-center">
          Ninguna materia coincide con la búsqueda o el filtro.
        </p>
      )}

      {cuatrimestresOrdenados.map((c) => {
        const materiasCuatri = materias.filter(
          (m) => m.cuatrimestre === c && idsVisibles.has(m.id)
        );
        if (materiasCuatri.length === 0) return null;
        const { aprobadas, total } = avancePorCuatrimestre(c, estados);
        return (
          <section key={c}>
            <div className="flex items-baseline justify-between mb-2.5">
              <h2 className="text-base font-bold text-(--ink)">
                {nombreCuatrimestre(c)}
              </h2>
              <span className="text-xs text-(--ink-muted)">
                {aprobadas}/{total} aprobadas
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {materiasCuatri.map((materia) => (
                <MateriaCard
                  key={materia.id}
                  materia={materia}
                  estado={estados[materia.id] ?? "P"}
                  estados={estados}
                  onToggle={() => onToggle(materia.id)}
                  readOnly={readOnly}
                />
              ))}
            </div>
          </section>
        );
      })}

      {!hayFiltro && (
        <p className="text-xs text-(--ink-muted)">
          Clic en una materia para pasar de{" "}
          {(["P", "C", "A", "E"] as EstadoMateria[])
            .map((e) => leyendaEstados[e])
            .join(" → ")}
          .
        </p>
      )}
    </div>
  );
}
