import { useState } from "react";
import {
  leyendaEstados,
  mapaMaterias,
  type Materia,
  type EstadoMateria,
  type Estados,
} from "@/data/materias";
import {
  materiaDisponible,
  correlativasFaltantes,
  estaAprobada,
  habilitaDirecto,
} from "@/lib/correlativas";

const colorEstado: Record<EstadoMateria, string> = {
  A: "var(--c-a)",
  E: "var(--c-e)",
  C: "var(--c-c)",
  P: "var(--c-p)",
};

export function MateriaCard({
  materia,
  estado,
  estados,
  onToggle,
  readOnly,
}: {
  materia: Materia;
  estado: EstadoMateria;
  estados: Estados;
  onToggle: () => void;
  readOnly: boolean;
}) {
  const [abierta, setAbierta] = useState(false);
  const disponible = materiaDisponible(materia, estados);
  const cursable = estado === "P" && disponible;
  const bloqueada = estado === "P" && !disponible;
  const faltantes = correlativasFaltantes(materia, estados);
  const habilita = habilitaDirecto[materia.id] ?? [];
  const tieneDetalle = materia.correlativas.length > 0 || habilita.length > 0;

  return (
    <div
      className={[
        "rounded-xl border bg-(--surface) transition-all duration-150",
        "border-(--border) hover:shadow-md hover:-translate-y-px",
        bloqueada ? "opacity-60" : "",
        cursable ? "ring-1 ring-(--accent)" : "",
      ].join(" ")}
    >
      <button
        onClick={onToggle}
        disabled={readOnly}
        title={
          readOnly
            ? leyendaEstados[estado]
            : `${leyendaEstados[estado]} — clic para cambiar`
        }
        className="w-full text-left p-3 flex items-start justify-between gap-2 cursor-pointer disabled:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) rounded-xl"
      >
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium leading-snug text-(--ink)">
            {materia.nombre}
          </div>
          {cursable && (
            <div className="mt-1 text-[11px] font-medium text-(--accent)">
              ✓ Disponible para cursar
            </div>
          )}
          {bloqueada && (
            <div className="mt-1 text-[11px] font-medium" style={{ color: "var(--c-bloq)" }}>
              ✕ Faltan {faltantes.length} correlativa{faltantes.length > 1 ? "s" : ""}
            </div>
          )}
        </div>
        <span
          className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white shrink-0 shadow-sm"
          style={{ background: colorEstado[estado] }}
          aria-label={leyendaEstados[estado]}
        >
          {estado}
        </span>
      </button>

      {tieneDetalle && (
        <div className="px-3 pb-2.5 -mt-1">
          <button
            onClick={() => setAbierta(!abierta)}
            className="text-[11px] text-(--ink-muted) hover:text-(--ink-2) underline underline-offset-2 cursor-pointer"
          >
            {abierta ? "ocultar detalle" : "ver detalle"}
          </button>
          {abierta && (
            <div className="mt-2 space-y-1.5 text-xs text-(--ink-2)">
              {materia.correlativas.length > 0 && (
                <div>
                  <span className="font-semibold text-(--ink)">Necesita:</span>
                  {materia.correlativas.map((cid) => {
                    const ok = estaAprobada(cid, estados);
                    return (
                      <div key={cid} className="flex items-center gap-1.5 mt-0.5">
                        <span style={{ color: ok ? "var(--c-a)" : "var(--c-bloq)" }}>
                          {ok ? "✓" : "✗"}
                        </span>
                        <span>{mapaMaterias[cid]?.nombre ?? cid}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              {habilita.length > 0 && (
                <div>
                  <span className="font-semibold text-(--ink)">Habilita:</span>
                  {habilita.map((hid) => (
                    <div key={hid} className="mt-0.5 pl-4">
                      {mapaMaterias[hid]?.nombre ?? hid}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
