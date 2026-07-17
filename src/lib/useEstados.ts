import { useState, useEffect, useCallback } from "react";
import type { Estados, EstadoMateria } from "@/data/materias";

const STORAGE_KEY = "siglo21-estados";
const CICLO: EstadoMateria[] = ["P", "C", "A", "E"];

export function useEstados() {
  const [estados, setEstados] = useState<Estados>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEstados(JSON.parse(raw));
    } catch {
      // storage corrupto o inaccesible: arrancamos vacío
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(estados));
    }
  }, [estados, loaded]);

  const toggleEstado = useCallback((id: string) => {
    setEstados((prev) => {
      const actual = prev[id] ?? "P";
      const nuevo = CICLO[(CICLO.indexOf(actual) + 1) % CICLO.length];
      return { ...prev, [id]: nuevo };
    });
  }, []);

  const setEstado = useCallback((id: string, estado: EstadoMateria) => {
    setEstados((prev) => ({ ...prev, [id]: estado }));
  }, []);

  const setEstadosImport = useCallback((nuevos: Estados) => {
    setEstados(nuevos);
  }, []);

  const resetEstados = useCallback(() => {
    setEstados({});
  }, []);

  return { estados, loaded, toggleEstado, setEstado, setEstadosImport, resetEstados };
}
