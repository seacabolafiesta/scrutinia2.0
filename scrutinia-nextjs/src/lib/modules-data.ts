export interface Module {
  id: number;
  title: string;
  description: string;
  videoId: string | null;
  duration: string;
  status?: 'coming_soon';
}

export const modules: Module[] = [
  {
    id: 0,
    title: "INTRODUCCIÓN",
    description: "Bienvenida y objetivos del curso de formación electoral. Entendiendo la importancia de la verificación ciudadana.",
    videoId: "1159605526",
    duration: "01:36"
  },
  {
    id: 1,
    title: "ESTRUCTURA EN ELECCIONES",
    description: "Comprendiendo el sistema electoral, la administración y los roles clave en el proceso.",
    videoId: "1159605724",
    duration: "03:21"
  },
  {
    id: 2,
    title: "COMO DEBE ESTAR EL COLEGIO ELECTORAL",
    description: "Requisitos físicos y legales del colegio electoral antes de la apertura. Cabinas, urnas y señalización.",
    videoId: "1159616669",
    duration: "04:46"
  },
  {
    id: 3,
    title: "APODERADOS",
    description: "Funciones, derechos y obligaciones de los apoderados. Cómo actuar durante la jornada.",
    videoId: "1159614046",
    duration: "04:26"
  },
  {
    id: 4,
    title: "CONSTITUCIÓN DE MESA Y VOTACIÓN",
    description: "Proceso de constitución de la mesa, acreditación de votantes y resolución de incidencias durante la votación.",
    videoId: "1159618067",
    duration: "05:30"
  },
  {
    id: 5,
    title: "ESCRUTINIO",
    description: "El momento clave: apertura de urnas, conteo de votos, votos nulos vs blancos, y redacción de actas.",
    videoId: "1159619505",
    duration: "11:16"
  },
  {
    id: 6,
    title: "CONSEJOS FINALES",
    description: "Recomendaciones y consejos finales para el día de las elecciones.",
    videoId: "1159622576",
    duration: "05:35"
  },
  {
    id: 7,
    title: "SCRUTINIA - USO DE LA APP",
    description: "Tutorial detallado sobre cómo utilizar la app Scrutinia para reportar datos.",
    videoId: null,
    status: "coming_soon",
    duration: "-"
  }
];
