import { useMemo, useState } from "react";
import {
  materias,
  mapaMaterias,
  cuatrimestresOrdenados,
  nombreCuatrimestreCorto,
  leyendaEstados,
  type Estados,
  type EstadoMateria,
} from "@/data/materias";
import {
  ancestros,
  descendientes,
  materiaDisponible,
  estaAprobada,
} from "@/lib/correlativas";

const NODO_W = 156;
const NODO_H = 38;
const COL_GAP = 52;
const FILA_GAP = 10;
const TOP = 34;

const colorEstado: Record<EstadoMateria, string> = {
  A: "var(--c-a)",
  E: "var(--c-e)",
  C: "var(--c-c)",
  P: "var(--c-p)",
};

interface Pos {
  x: number;
  y: number;
}

function truncar(nombre: string, max = 21): string {
  return nombre.length > max ? nombre.slice(0, max - 1).trimEnd() + "…" : nombre;
}

export function MapaView({
  estados,
  onToggle,
  readOnly,
}: {
  estados: Estados;
  onToggle: (id: string) => void;
  readOnly: boolean;
}) {
  const [hover, setHover] = useState<string | null>(null);

  const { posiciones, ancho, alto } = useMemo(() => {
    const posiciones: Record<string, Pos> = {};
    let maxFilas = 0;
    cuatrimestresOrdenados.forEach((c, col) => {
      const enCuatri = materias.filter((m) => m.cuatrimestre === c);
      maxFilas = Math.max(maxFilas, enCuatri.length);
      enCuatri.forEach((m, fila) => {
        posiciones[m.id] = {
          x: 8 + col * (NODO_W + COL_GAP),
          y: TOP + fila * (NODO_H + FILA_GAP),
        };
      });
    });
    return {
      posiciones,
      ancho: 8 + cuatrimestresOrdenados.length * (NODO_W + COL_GAP) - COL_GAP + 8,
      alto: TOP + maxFilas * (NODO_H + FILA_GAP),
    };
  }, []);

  const relacion = useMemo(() => {
    if (!hover) return null;
    return {
      requisitos: ancestros(hover),
      habilitadas: descendientes(hover),
    };
  }, [hover]);

  const esRelacionada = (id: string) =>
    !relacion ||
    id === hover ||
    relacion.requisitos.has(id) ||
    relacion.habilitadas.has(id);

  const edges = useMemo(
    () =>
      materias.flatMap((m) =>
        m.correlativas.map((c) => ({ desde: c, hasta: m.id }))
      ),
    []
  );

  const materiaHover = hover ? mapaMaterias[hover] : null;

  return (
    <div className="space-y-4">
      <p className="text-xs text-(--ink-muted)">
        Pasá el mouse sobre una materia para ver su cadena de correlativas: en{" "}
        <span className="font-semibold" style={{ color: "var(--c-bloq)" }}>rojo</span> lo
        que necesita, en <span className="font-semibold text-(--accent)">azul</span> lo
        que habilita.{!readOnly && " Clic para cambiar el estado."}
      </p>

      <div className="overflow-x-auto rounded-xl border border-(--border) bg-(--surface) p-2">
        <svg
          width={ancho}
          height={alto}
          viewBox={`0 0 ${ancho} ${alto}`}
          role="img"
          aria-label="Mapa de correlativas del plan de estudios"
          onMouseLeave={() => setHover(null)}
        >
          {/* Encabezados de columna */}
          {cuatrimestresOrdenados.map((c, col) => (
            <text
              key={c}
              x={8 + col * (NODO_W + COL_GAP) + NODO_W / 2}
              y={18}
              textAnchor="middle"
              fontSize={12}
              fontWeight={700}
              fill="var(--ink-2)"
            >
              {nombreCuatrimestreCorto(c)}
            </text>
          ))}

          {/* Aristas */}
          {edges.map(({ desde, hasta }) => {
            const a = posiciones[desde];
            const b = posiciones[hasta];
            if (!a || !b) return null;
            const x1 = a.x + NODO_W;
            const y1 = a.y + NODO_H / 2;
            const x2 = b.x;
            const y2 = b.y + NODO_H / 2;
            const mx = (x1 + x2) / 2;
            const activa =
              hover &&
              esRelacionada(desde) &&
              esRelacionada(hasta) &&
              (desde === hover ||
                hasta === hover ||
                relacion!.requisitos.has(hasta) ||
                relacion!.habilitadas.has(desde));
            const haciaRequisito =
              hover && (hasta === hover || relacion!.requisitos.has(hasta));
            return (
              <path
                key={`${desde}-${hasta}`}
                d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke={
                  activa
                    ? haciaRequisito
                      ? "var(--c-bloq)"
                      : "var(--accent)"
                    : "var(--grid)"
                }
                strokeWidth={activa ? 2.5 : 1.5}
                opacity={hover && !activa ? 0.25 : 1}
              />
            );
          })}

          {/* Nodos */}
          {materias.map((m) => {
            const p = posiciones[m.id];
            const estado = estados[m.id] ?? "P";
            const cursable = estado === "P" && materiaDisponible(m, estados);
            const relacionada = esRelacionada(m.id);
            const esRequisito = relacion?.requisitos.has(m.id);
            const esHabilitada = relacion?.habilitadas.has(m.id);
            return (
              <g
                key={m.id}
                transform={`translate(${p.x}, ${p.y})`}
                opacity={relacionada ? 1 : 0.22}
                onMouseEnter={() => setHover(m.id)}
                onClick={() => !readOnly && onToggle(m.id)}
                style={{ cursor: readOnly ? "default" : "pointer" }}
              >
                <title>{`${m.nombre} — ${leyendaEstados[estado]}`}</title>
                <rect
                  width={NODO_W}
                  height={NODO_H}
                  rx={9}
                  fill={colorEstado[estado]}
                  stroke={
                    m.id === hover
                      ? "var(--ink)"
                      : esRequisito
                        ? "var(--c-bloq)"
                        : esHabilitada
                          ? "var(--accent)"
                          : cursable
                            ? "var(--accent)"
                            : "transparent"
                  }
                  strokeWidth={m.id === hover ? 2.5 : 2}
                />
                <text
                  x={10}
                  y={NODO_H / 2 + 1}
                  fontSize={11}
                  fontWeight={600}
                  fill="#ffffff"
                  dominantBaseline="middle"
                >
                  {truncar(m.nombre)}
                </text>
                <text
                  x={NODO_W - 10}
                  y={NODO_H / 2 + 1}
                  fontSize={10}
                  fontWeight={700}
                  fill="rgba(255,255,255,0.85)"
                  textAnchor="end"
                  dominantBaseline="middle"
                >
                  {estado}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Panel de detalle de la materia bajo el cursor */}
      <div className="min-h-16 rounded-xl border border-(--border) bg-(--surface) px-4 py-3 text-sm">
        {materiaHover ? (
          <div className="space-y-1">
            <div className="font-semibold text-(--ink)">
              {materiaHover.nombre}{" "}
              <span className="font-normal text-(--ink-muted)">
                — {leyendaEstados[estados[materiaHover.id] ?? "P"]}
              </span>
            </div>
            {materiaHover.correlativas.length > 0 ? (
              <div className="text-xs text-(--ink-2)">
                <span className="font-semibold">Necesita:</span>{" "}
                {materiaHover.correlativas
                  .map(
                    (c) =>
                      `${mapaMaterias[c]?.nombre ?? c}${estaAprobada(c, estados) ? " ✓" : " ✗"}`
                  )
                  .join(" · ")}
              </div>
            ) : (
              <div className="text-xs text-(--ink-2)">Sin correlativas.</div>
            )}
            {descendientes(materiaHover.id).size > 0 && (
              <div className="text-xs text-(--ink-2)">
                <span className="font-semibold">Habilita (en cadena):</span>{" "}
                {[...descendientes(materiaHover.id)]
                  .map((id) => mapaMaterias[id]?.nombre ?? id)
                  .join(" · ")}
              </div>
            )}
          </div>
        ) : (
          <span className="text-xs text-(--ink-muted)">
            Pasá el cursor sobre el mapa para ver el detalle de una materia.
          </span>
        )}
      </div>
    </div>
  );
}
