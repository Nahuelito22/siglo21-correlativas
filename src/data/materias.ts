export interface Materia {
  id: string;
  nombre: string;
  cuatrimestre: number;
  correlativas: string[];
}

export const materias: Materia[] = [
  { id: "I1", nombre: "Aprender en el Siglo 21", cuatrimestre: 0, correlativas: [] },
  { id: "I2", nombre: "Tecnología, Humanidades y Modelos Globales", cuatrimestre: 0, correlativas: [] },
  { id: "1", nombre: "Álgebra y Geometría", cuatrimestre: 1, correlativas: [] },
  { id: "2", nombre: "Lógica Simbólica", cuatrimestre: 1, correlativas: [] },
  { id: "3", nombre: "Introducción a la Ciencia de Datos", cuatrimestre: 1, correlativas: [] },
  { id: "4", nombre: "Sistemas de Información", cuatrimestre: 1, correlativas: [] },
  { id: "5", nombre: "Introducción a los Algoritmos", cuatrimestre: 1, correlativas: [] },
  { id: "6", nombre: "Idioma Extranjero I", cuatrimestre: 1, correlativas: [] },
  { id: "7", nombre: "Análisis Matemático", cuatrimestre: 2, correlativas: [] },
  { id: "8", nombre: "Programación Orientada a Objetos", cuatrimestre: 2, correlativas: ["5"] },
  { id: "9", nombre: "Análisis de Datos", cuatrimestre: 2, correlativas: [] },
  { id: "10", nombre: "Estadística y Probabilidad", cuatrimestre: 2, correlativas: [] },
  { id: "11", nombre: "Base de Datos I", cuatrimestre: 2, correlativas: [] },
  { id: "12", nombre: "Idioma Extranjero II", cuatrimestre: 2, correlativas: ["6"] },
  { id: "13", nombre: "Introducción a Tecnologías de Información y Comunicaciones", cuatrimestre: 3, correlativas: [] },
  { id: "14", nombre: "Algoritmos y Estructuras de Datos I", cuatrimestre: 3, correlativas: ["8"] },
  { id: "15", nombre: "Sistemas Operativos", cuatrimestre: 3, correlativas: [] },
  { id: "16", nombre: "Base de Datos II", cuatrimestre: 3, correlativas: ["11"] },
  { id: "17", nombre: "Innovación Tecnológica", cuatrimestre: 3, correlativas: [] },
  { id: "18", nombre: "Idioma Extranjero III", cuatrimestre: 3, correlativas: ["12"] },
  { id: "19", nombre: "Práctica Solidaria", cuatrimestre: 3, correlativas: [] },
  { id: "20", nombre: "Sistemas Operativos Avanzados", cuatrimestre: 4, correlativas: ["15"] },
  { id: "21", nombre: "Algoritmos y Estructuras de Datos II", cuatrimestre: 4, correlativas: ["14"] },
  { id: "22", nombre: "Comunicaciones", cuatrimestre: 4, correlativas: [] },
  { id: "23", nombre: "Programación para Ciencia de Datos", cuatrimestre: 4, correlativas: ["8"] },
  { id: "24", nombre: "Metodología de Análisis de Datos Cuantitativos", cuatrimestre: 4, correlativas: [] },
  { id: "25", nombre: "Idioma Extranjero IV", cuatrimestre: 4, correlativas: ["18"] },
  { id: "26", nombre: "Inteligencia Artificial", cuatrimestre: 5, correlativas: [] },
  { id: "27", nombre: "Legislación de Proyectos Tecnológicos", cuatrimestre: 5, correlativas: [] },
  { id: "28", nombre: "Seguridad Informática", cuatrimestre: 5, correlativas: [] },
  { id: "29", nombre: "Visualización de Datos", cuatrimestre: 5, correlativas: ["9"] },
  { id: "30", nombre: "Ética y Deontología Profesional", cuatrimestre: 5, correlativas: [] },
  { id: "31", nombre: "Idioma Extranjero V", cuatrimestre: 5, correlativas: ["25"] },
  { id: "32", nombre: "Herramientas Matemáticas VI - Modelos de Simulación", cuatrimestre: 6, correlativas: [] },
  { id: "33", nombre: "Estrategia", cuatrimestre: 6, correlativas: [] },
  { id: "34", nombre: "Computación en la Nube", cuatrimestre: 6, correlativas: [] },
  { id: "35", nombre: "Grupo y Liderazgo", cuatrimestre: 6, correlativas: [] },
  { id: "36", nombre: "Idioma Extranjero VI", cuatrimestre: 6, correlativas: [] },
  { id: "37", nombre: "Seminario de Práctica en Ciencia de Datos", cuatrimestre: 6, correlativas: ["16", "23", "29"] },
  { id: "38", nombre: "Privacidad y Seguridad de los Datos", cuatrimestre: 7, correlativas: [] },
  { id: "39", nombre: "Aprendizaje Automático", cuatrimestre: 7, correlativas: ["23", "26"] },
  { id: "40", nombre: "Desarrollo Emprendedor", cuatrimestre: 7, correlativas: [] },
  { id: "41", nombre: "Inteligencia de Negocios", cuatrimestre: 7, correlativas: ["16"] },
  { id: "42", nombre: "Oratoria", cuatrimestre: 7, correlativas: [] },
  { id: "43", nombre: "Práctica Profesional en Ciencia de Datos", cuatrimestre: 7, correlativas: ["37"] },
  { id: "44", nombre: "Procesamiento de Lenguaje Natural", cuatrimestre: 8, correlativas: ["26"] },
  { id: "45", nombre: "Metodología de Diseño y Planificación de Proyectos", cuatrimestre: 8, correlativas: [] },
  { id: "46", nombre: "Aprendizaje Profundo", cuatrimestre: 8, correlativas: ["23", "26"] },
  { id: "47", nombre: "Auditoría de Sistemas", cuatrimestre: 8, correlativas: [] },
  { id: "48", nombre: "Emprendimientos Universitarios", cuatrimestre: 8, correlativas: [] },
  { id: "49", nombre: "Seminario Final en Ciencia de Datos", cuatrimestre: 8, correlativas: ["37", "43"] },
  { id: "50", nombre: "Electiva 1", cuatrimestre: 11, correlativas: [] },
  { id: "51", nombre: "Electiva 2", cuatrimestre: 11, correlativas: [] },
];

export type EstadoMateria = "A" | "E" | "C" | "P";

export type Estados = Record<string, EstadoMateria>;

export const cuatrimestresOrdenados = [0, 1, 2, 3, 4, 5, 6, 7, 8, 11];

export const nombreCuatrimestre = (c: number): string => {
  if (c === 0) return "Inicial";
  if (c === 11) return "Electivas";
  return `${c}° Cuatrimestre`;
};

export const nombreCuatrimestreCorto = (c: number): string => {
  if (c === 0) return "Inicial";
  if (c === 11) return "Electivas";
  return `${c}° C`;
};

export const leyendaEstados: Record<EstadoMateria, string> = {
  A: "Aprobado",
  E: "Eximido",
  C: "Cursando",
  P: "Pendiente",
};

export const mapaMaterias: Record<string, Materia> = Object.fromEntries(
  materias.map((m) => [m.id, m])
);
