import { materias, mapaMaterias, type Materia, type Estados } from "@/data/materias";

export function estaAprobada(id: string, estados: Estados): boolean {
  const est = estados[id];
  return est === "A" || est === "E";
}

export function materiaDisponible(materia: Materia, estados: Estados): boolean {
  return materia.correlativas.every((id) => estaAprobada(id, estados));
}

export function correlativasFaltantes(materia: Materia, estados: Estados): string[] {
  return materia.correlativas.filter((id) => !estaAprobada(id, estados));
}

/** Materias en estado Pendiente cuyas correlativas ya están cumplidas. */
export function disponiblesParaCursar(estados: Estados): Materia[] {
  return materias.filter(
    (m) => (estados[m.id] ?? "P") === "P" && materiaDisponible(m, estados)
  );
}

/** Materias que tienen a `id` como correlativa directa. */
export const habilitaDirecto: Record<string, string[]> = (() => {
  const mapa: Record<string, string[]> = {};
  for (const m of materias) {
    for (const c of m.correlativas) {
      (mapa[c] ??= []).push(m.id);
    }
  }
  return mapa;
})();

/** Cadena completa de requisitos (correlativas, y las de esas, etc.). */
export function ancestros(id: string): Set<string> {
  const out = new Set<string>();
  const visitar = (mid: string) => {
    for (const c of mapaMaterias[mid]?.correlativas ?? []) {
      if (!out.has(c)) {
        out.add(c);
        visitar(c);
      }
    }
  };
  visitar(id);
  return out;
}

/** Cadena completa de materias que esta materia habilita (directa o indirectamente). */
export function descendientes(id: string): Set<string> {
  const out = new Set<string>();
  const visitar = (mid: string) => {
    for (const h of habilitaDirecto[mid] ?? []) {
      if (!out.has(h)) {
        out.add(h);
        visitar(h);
      }
    }
  };
  visitar(id);
  return out;
}

export function calcularAvance(estados: Estados): {
  aprobadas: number;
  total: number;
  porcentaje: number;
} {
  const total = materias.length;
  const aprobadas = materias.filter((m) => estaAprobada(m.id, estados)).length;
  const porcentaje = total > 0 ? Math.round((aprobadas / total) * 100) : 0;
  return { aprobadas, total, porcentaje };
}

export function avancePorCuatrimestre(
  cuatrimestre: number,
  estados: Estados
): { aprobadas: number; cursando: number; total: number } {
  const filtradas = materias.filter((m) => m.cuatrimestre === cuatrimestre);
  return {
    total: filtradas.length,
    aprobadas: filtradas.filter((m) => estaAprobada(m.id, estados)).length,
    cursando: filtradas.filter((m) => estados[m.id] === "C").length,
  };
}
