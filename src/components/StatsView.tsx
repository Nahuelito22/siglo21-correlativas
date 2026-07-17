import { useMemo } from "react";
import {
  materias,
  mapaMaterias,
  cuatrimestresOrdenados,
  nombreCuatrimestre,
  type Estados,
} from "@/data/materias";
import {
  calcularAvance,
  avancePorCuatrimestre,
  disponiblesParaCursar,
  materiaDisponible,
  correlativasFaltantes,
} from "@/lib/correlativas";

function Tile({
  valor,
  label,
  color,
}: {
  valor: number;
  label: string;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-(--border) bg-(--surface) px-4 py-3">
      <div
        className="text-2xl font-bold"
        style={{ color: color ?? "var(--ink)" }}
      >
        {valor}
      </div>
      <div className="text-xs text-(--ink-2) mt-0.5">{label}</div>
    </div>
  );
}

export function StatsView({ estados }: { estados: Estados }) {
  const { aprobadas, total, porcentaje } = calcularAvance(estados);
  const cursando = materias.filter((m) => estados[m.id] === "C").length;
  const disponibles = useMemo(() => disponiblesParaCursar(estados), [estados]);
  const bloqueadas = useMemo(
    () =>
      materias.filter(
        (m) => (estados[m.id] ?? "P") === "P" && !materiaDisponible(m, estados)
      ),
    [estados]
  );
  const porDesbloquear = useMemo(
    () =>
      bloqueadas
        .map((m) => ({ materia: m, faltantes: correlativasFaltantes(m, estados) }))
        .filter(({ faltantes }) => faltantes.length === 1),
    [bloqueadas, estados]
  );

  return (
    <div className="space-y-6">
      {/* Héroe: avance total */}
      <div className="rounded-xl border border-(--border) bg-(--surface) px-5 py-4">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-(--ink)">{porcentaje}%</span>
          <span className="text-sm text-(--ink-2)">
            de la carrera — {aprobadas} de {total} materias aprobadas
            {cursando > 0 && `, ${cursando} en curso`}
          </span>
        </div>
        <div
          className="mt-3 h-3 rounded-full overflow-hidden flex"
          style={{ background: "var(--grid)" }}
          role="img"
          aria-label={`Avance: ${porcentaje}% aprobado`}
        >
          <div
            style={{ width: `${(aprobadas / total) * 100}%`, background: "var(--c-a)" }}
          />
          <div
            style={{
              width: `${(cursando / total) * 100}%`,
              background: "var(--c-c)",
              marginLeft: aprobadas > 0 ? 2 : 0,
            }}
          />
        </div>
      </div>

      {/* Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Tile valor={aprobadas} label="Aprobadas / eximidas" color="var(--c-a)" />
        <Tile valor={cursando} label="Cursando" color="var(--c-c)" />
        <Tile valor={disponibles.length} label="Disponibles para cursar" color="var(--accent)" />
        <Tile valor={bloqueadas.length} label="Bloqueadas por correlativas" color="var(--c-bloq)" />
      </div>

      {/* Avance por cuatrimestre */}
      <section className="rounded-xl border border-(--border) bg-(--surface) px-5 py-4">
        <h3 className="text-sm font-bold text-(--ink) mb-3">
          Avance por cuatrimestre
        </h3>
        <div className="space-y-2">
          {cuatrimestresOrdenados.map((c) => {
            const { aprobadas: a, cursando: cu, total: t } =
              avancePorCuatrimestre(c, estados);
            return (
              <div key={c} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-xs text-(--ink-2)">
                  {nombreCuatrimestre(c)}
                </span>
                <div
                  className="flex-1 h-2.5 rounded-full overflow-hidden flex"
                  style={{ background: "var(--grid)" }}
                >
                  <div
                    style={{ width: `${(a / t) * 100}%`, background: "var(--c-a)" }}
                  />
                  <div
                    style={{
                      width: `${(cu / t) * 100}%`,
                      background: "var(--c-c)",
                      marginLeft: a > 0 && cu > 0 ? 2 : 0,
                    }}
                  />
                </div>
                <span className="w-12 shrink-0 text-right text-xs tabular-nums text-(--ink-muted)">
                  {a}/{t}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-3 text-[11px] text-(--ink-muted)">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "var(--c-a)" }} />
            Aprobadas
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "var(--c-c)" }} />
            Cursando
          </span>
        </div>
      </section>

      {/* Disponibles ahora */}
      <section className="rounded-xl border border-(--border) bg-(--surface) px-5 py-4">
        <h3 className="text-sm font-bold text-(--ink) mb-1">
          Disponibles para cursar ahora
        </h3>
        <p className="text-xs text-(--ink-muted) mb-3">
          Pendientes con todas sus correlativas cumplidas.
        </p>
        {disponibles.length === 0 ? (
          <p className="text-xs text-(--ink-2)">
            No hay materias disponibles — revisá las que están en curso o bloqueadas.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {disponibles.map((m) => (
              <span
                key={m.id}
                className="px-2.5 py-1 rounded-full text-xs font-medium border border-(--accent) text-(--accent)"
                style={{ background: "var(--accent-soft)" }}
              >
                {m.nombre}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* A una materia de desbloquear */}
      {porDesbloquear.length > 0 && (
        <section className="rounded-xl border border-(--border) bg-(--surface) px-5 py-4">
          <h3 className="text-sm font-bold text-(--ink) mb-1">
            A una correlativa de desbloquearse
          </h3>
          <p className="text-xs text-(--ink-muted) mb-3">
            Te falta aprobar una sola materia para habilitar cada una de estas.
          </p>
          <div className="space-y-1.5">
            {porDesbloquear.map(({ materia, faltantes }) => (
              <div key={materia.id} className="text-xs text-(--ink-2)">
                <span className="font-semibold text-(--ink)">{materia.nombre}</span>{" "}
                ← te falta{" "}
                <span style={{ color: "var(--c-bloq)" }}>
                  {mapaMaterias[faltantes[0]]?.nombre ?? faltantes[0]}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
