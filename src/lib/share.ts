import { materias, type Estados, type EstadoMateria } from "@/data/materias";

const ORDEN = materias.map((m) => m.id);
const VALIDOS = new Set(["A", "E", "C", "P"]);
export const PARAM = "p";

/** Codifica los estados como una cadena compacta: una letra por materia, en orden fijo. */
export function codificarEstados(estados: Estados): string {
  let s = ORDEN.map((id) => estados[id] ?? "P").join("");
  return s.replace(/P+$/, "");
}

export function decodificarEstados(codigo: string): Estados | null {
  if (codigo.length > ORDEN.length) return null;
  const estados: Estados = {};
  for (let i = 0; i < codigo.length; i++) {
    const c = codigo[i];
    if (!VALIDOS.has(c)) return null;
    if (c !== "P") estados[ORDEN[i]] = c as EstadoMateria;
  }
  return estados;
}

export function crearLinkCompartir(estados: Estados): string {
  const url = new URL(window.location.href);
  url.search = "";
  const codigo = codificarEstados(estados);
  if (codigo) url.searchParams.set(PARAM, codigo);
  return url.toString();
}

/** Lee un progreso compartido desde la URL actual (o null si no hay). */
export function leerCompartido(): Estados | null {
  const codigo = new URLSearchParams(window.location.search).get(PARAM);
  if (!codigo) return null;
  return decodificarEstados(codigo);
}

export function limpiarParamCompartido(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete(PARAM);
  window.history.replaceState({}, "", url.toString());
}
