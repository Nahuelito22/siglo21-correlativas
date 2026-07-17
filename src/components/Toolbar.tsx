import { useRef, useState } from "react";
import type { Estados, EstadoMateria } from "@/data/materias";
import { materias } from "@/data/materias";
import { crearLinkCompartir } from "@/lib/share";

const btn =
  "px-3 py-1.5 text-xs font-medium rounded-lg border border-(--border) bg-(--surface) text-(--ink-2) hover:text-(--ink) hover:shadow-sm transition-all cursor-pointer";

const VALIDOS = new Set(["A", "E", "C", "P"]);
const IDS = new Set(materias.map((m) => m.id));

function esEstadosValido(data: unknown): data is Estados {
  return (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data) &&
    Object.entries(data).every(
      ([id, est]) => IDS.has(id) && typeof est === "string" && VALIDOS.has(est)
    )
  );
}

export function Toolbar({
  estados,
  onImport,
  onReset,
}: {
  estados: Estados;
  onImport: (estados: Estados) => void;
  onReset: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [copiado, setCopiado] = useState(false);

  const compartir = async () => {
    const link = crearLinkCompartir(estados);
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      prompt("Copiá el link para compartir tu avance:", link);
    }
  };

  const exportar = () => {
    const blob = new Blob([JSON.stringify(estados, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "siglo21-avance.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (!esEstadosValido(data)) {
          alert("El archivo no tiene el formato esperado de avance.");
          return;
        }
        onImport(data as Estados as Record<string, EstadoMateria>);
      } catch {
        alert("El archivo no es un JSON válido.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const resetear = () => {
    if (confirm("¿Borrar todo tu avance? Esta acción no se puede deshacer.")) {
      onReset();
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={compartir} className={btn}>
        {copiado ? "✓ Link copiado" : "🔗 Compartir avance"}
      </button>
      <button onClick={exportar} className={btn}>
        Exportar JSON
      </button>
      <button onClick={() => inputRef.current?.click()} className={btn}>
        Importar JSON
      </button>
      <button
        onClick={resetear}
        className="px-3 py-1.5 text-xs font-medium rounded-lg border bg-(--surface) transition-all cursor-pointer hover:shadow-sm"
        style={{ borderColor: "var(--c-bloq)", color: "var(--c-bloq)" }}
      >
        Resetear
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        onChange={onArchivo}
        className="hidden"
      />
    </div>
  );
}
