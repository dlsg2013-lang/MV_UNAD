/* =========================================================================
   malla-data.js
   -------------------------------------------------------------------------
   Fuente de datos de la malla académica.

   CÓMO SE ARMAN LOS PRERREQUISITOS
   La imagen original no rotula explícitamente "curso X requiere curso Y":
   dibuja flechitas de color en la esquina de algunos cursos. Cada color de
   flecha es un "hilo" temático que atraviesa varios periodos (ej. todas las
   flechas azules son un mismo hilo). Un curso con UNA flecha continúa un
   solo hilo; un curso con DOS flechas de colores distintos es el punto donde
   convergen dos hilos (requiere lo último de ambos).

   Por eso cada curso tiene un campo `hilos: [...]` con los colores de flecha
   que se le ven en la imagen. Con eso, este archivo arma automáticamente el
   grafo de prerrequisitos: recorre los periodos en orden y, para cada color,
   recuerda cuál fue el último curso que lo usó — ese es el prerrequisito.

   Es una transcripción visual cuidadosa, pero no reemplaza el pénsum
   oficial. Si algo no calza, corrige el arreglo `hilos` de ese curso —todo
   el grafo se recalcula solo, no hay que tocar más nada.
   ========================================================================= */

// Tipo de curso: T = Teórico, P = Práctico, M = Metodológico
const TIPO_INFO = {
  T: { label: "Teórico",       color: "#D26714" },
  P: { label: "Práctico",      color: "#C9930C" },
  M: { label: "Metodológico",  color: "#035B3B" },
};

// Un color por periodo, derivado de tu paleta institucional
const PERIODO_COLORES = [
  "#00445B", "#0B5266", "#166071", "#1B6E71", "#217A66",
  "#2E8460", "#4C8A52", "#7C8A3E", "#AC7A28", "#D26714",
];

const MALLA = [
  {
    id: "p1", numero: "I", creditos: 19,
    cursos: [
      { id: "p1c1", tipo: "M", creditos: 2, nombre: "Introducción a la Medicina Veterinaria" },
      { id: "p1c2", tipo: "M", creditos: 3, nombre: "Biología celular y molecular", codigo: "30176", hilos: ["hilo4", "hilo6"] },
      { id: "p1c3", tipo: "M", creditos: 3, nombre: "Química orgánica", codigo: "300047", hilos: ["hilo7"] },
      { id: "p1c4", tipo: "M", creditos: 2, nombre: "Fundamentos del enfoque One Health", hilos: ["hilo1"] },
      { id: "p1c5", tipo: "M", creditos: 3, nombre: "Cátedra Unadista", codigo: "80017" },
      { id: "p1c6", tipo: "T", creditos: 3, nombre: "Competencias Comunicativas", codigo: "40003" },
      { id: "p1c7", tipo: "T", creditos: 3, nombre: "Ética y Ciudadanía (grado)", codigo: "400002", hilos: ["hilo2"] },
    ],
  },
  {
    id: "p2", numero: "II", creditos: 19,
    cursos: [
      { id: "p2c1", tipo: "P", creditos: 4, nombre: "Anatomía Veterinaria comparada", hilos: ["hilo6"] },
      { id: "p2c2", tipo: "P", creditos: 2, nombre: "Biología del desarrollo y fisiología animal", hilos: ["hilo4", "hilo6"] },
      { id: "p2c3", tipo: "M", creditos: 3, nombre: "Bioquímica metabólica", codigo: "352001", hilos: ["hilo7", "hilo8"] },
      { id: "p2c4", tipo: "M", creditos: 2, nombre: "Bioética y legislación Veterinaria", hilos: ["hilo3"] },
      { id: "p2c5", tipo: "M", creditos: 3, nombre: "Herramientas digitales para la gestión del conocimiento", codigo: "200610", hilos: ["hilo5", "hilo6"] },
      { id: "p2c6", tipo: "T", creditos: 3, nombre: "Pensamiento lógico y matemático", codigo: "200611", hilos: ["hilo9"] },
    ],
  },
  {
    id: "p3", numero: "III", creditos: 17,
    cursos: [
      { id: "p3c1", tipo: "P", creditos: 3, nombre: "Inmunología", hilos: ["hilo6"] },
      { id: "p3c2", tipo: "P", creditos: 2, nombre: "Nutrición clínica", hilos: ["hilo7"] },
      { id: "p3c3", tipo: "M", creditos: 3, nombre: "Genética y Genómica Aplicada a la Medicina Veterinaria.", hilos: ["hilo4", "hilo5"] },
      { id: "p3c4", tipo: "T", creditos: 3, nombre: "Estadística Descriptiva Aplicada a las Ciencias Agrarias", codigo: "300032", hilos: ["hilo9"] },
      { id: "p3c5", tipo: "P", creditos: 2, nombre: "Semiología y Competencias Clínicas Veterinarias", hilos: ["hilo6"] },
      { id: "p3c6", tipo: "M", creditos: 2, nombre: "Transformación Digital y Tecnologías Emergentes en Medicina Veterinaria", hilos: ["hilo9"] },
      { id: "p3c7", tipo: "P", creditos: 3, nombre: "Patología general y sistémica", hilos: ["hilo6"] },
      { id: "p3c8", tipo: "M", creditos: 1, nombre: "Prestación del Servicio Social Unadista (Requisito de grado)", codigo: "700004" },
    ],
  },
  {
    id: "p4", numero: "IV", creditos: 17,
    cursos: [
      { id: "p4c1", tipo: "P", creditos: 3, nombre: "Patología diagnóstica y de laboratorio clínico", hilos: ["hilo6"] },
      { id: "p4c2", tipo: "P", creditos: 2, nombre: "Microbiología veterinaria", hilos: ["hilo8"] },
      { id: "p4c3", tipo: "P", creditos: 2, nombre: "Parasitología veterinaria", hilos: ["hilo8"] },
      { id: "p4c4", tipo: "T", creditos: 2, nombre: "Diseño experimental", codigo: "300004", hilos: ["hilo9"] },
      { id: "p4c5", tipo: "P", creditos: 2, nombre: "Etología y bienestar animal", hilos: ["hilo3"] },
      { id: "p4c6", tipo: "M", creditos: 3, nombre: "Fundamentos en gestión integral", codigo: "112001", hilos: ["hilo9"] },
      { id: "p4c7", tipo: "P", creditos: 2, nombre: "Virología animal", hilos: ["hilo8"] },
      { id: "p4c8", tipo: "T", creditos: 1, nombre: "Electiva campo de formación complementaria" },
    ],
  },
  {
    id: "p5", numero: "V", creditos: 18,
    cursos: [
      { id: "p5c1", tipo: "M", creditos: 3, nombre: "Farmacología veterinaria", hilos: ["hilo8"] },
      { id: "p5c2", tipo: "M", creditos: 3, nombre: "Fundamentos y Generalidades de Investigación", codigo: "150001", hilos: ["hilo9"] },
      { id: "p5c3", tipo: "P", creditos: 2, nombre: "Toxicología veterinaria", hilos: ["hilo8"] },
      { id: "p5c4", tipo: "T", creditos: 3, nombre: "Diseño y evaluación de proyectos", codigo: "331005", hilos: ["hilo9"] },
      { id: "p5c5", tipo: "P", creditos: 2, nombre: "Biotecnologías y Manejo Reproductivo", hilos: ["hilo4"] },
      { id: "p5c6", tipo: "P", creditos: 2, nombre: "Epidemiología y salud pública Veterinaria", hilos: ["hilo3", "hilo6"] },
      { id: "p5c7", tipo: "M", creditos: 3, nombre: "Electivo IBC" },
    ],
  },
  {
    id: "p6", numero: "VI", creditos: 19,
    cursos: [
      { id: "p6c1", tipo: "P", creditos: 3, nombre: "Imagenología Veterinaria", hilos: ["hilo8"] },
      { id: "p6c2", tipo: "P", creditos: 4, nombre: "Cirugía, anestesiología y manejo del dolor", hilos: ["hilo8"] },
      { id: "p6c3", tipo: "P", creditos: 3, nombre: "Medicina interna de rumiantes", hilos: ["hilo8"] },
      { id: "p6c4", tipo: "M", creditos: 3, nombre: "Inglés A1", codigo: "900001", hilos: ["hilo10"] },
      { id: "p6c5", tipo: "M", creditos: 3, nombre: "Electivo DC" },
      { id: "p6c6", tipo: "T", creditos: 1, nombre: "Electivo de formación complementaria" },
      { id: "p6c7", tipo: "M", creditos: 2, nombre: "Electivo DC" },
    ],
  },
  {
    id: "p7", numero: "VII", creditos: 17,
    cursos: [
      { id: "p7c1", tipo: "P", creditos: 2, nombre: "Medicina de urgencias y cuidados intensivos", hilos: ["hilo8"] },
      { id: "p7c2", tipo: "P", creditos: 3, nombre: "Medicina interna de pequeños animales", hilos: ["hilo8"] },
      { id: "p7c3", tipo: "P", creditos: 3, nombre: "Medicina Interna en Equinos", hilos: ["hilo8"] },
      { id: "p7c4", tipo: "M", creditos: 3, nombre: "Inglés A2", codigo: "900002", hilos: ["hilo10"] },
      { id: "p7c5", tipo: "T", creditos: 2, nombre: "Trabajo de Grado", codigo: "204015", hilos: ["hilo9"] },
      { id: "p7c6", tipo: "P", creditos: 2, nombre: "Medicina y producción aviar", hilos: ["hilo8"] },
      { id: "p7c7", tipo: "P", creditos: 2, nombre: "Medicina y producción porcina", hilos: ["hilo8"] },
    ],
  },
  {
    id: "p8", numero: "VIII", creditos: 18,
    cursos: [
      { id: "p8c1", tipo: "P", creditos: 4, nombre: "Rotación Clínica de pequeños animales", hilos: ["hilo8"] },
      { id: "p8c2", tipo: "P", creditos: 4, nombre: "Rotación Clínica en Medicina y cirugía equina", hilos: ["hilo8"] },
      { id: "p8c3", tipo: "T", creditos: 2, nombre: "Mercadeo Agropecuario", codigo: "300005" },
      { id: "p8c4", tipo: "M", creditos: 3, nombre: "Inglés B1", codigo: "900003", hilos: ["hilo10"] },
      { id: "p8c5", tipo: "P", creditos: 3, nombre: "Electivo Disciplinar Específico Línea 1" },
      { id: "p8c6", tipo: "P", creditos: 2, nombre: "Medicina de fauna silvestre y exótica", hilos: ["hilo8"] },
    ],
  },
  {
    id: "p9", numero: "IX", creditos: 17,
    cursos: [
      { id: "p9c1", tipo: "P", creditos: 4, nombre: "Rotación sistemas de producción animal", hilos: ["hilo8"] },
      { id: "p9c2", tipo: "P", creditos: 4, nombre: "Rotación Reproducción y biotecnología veterinaria", hilos: ["hilo8"] },
      { id: "p9c3", tipo: "M", creditos: 1, nombre: "Electivo de formación complementaria" },
      { id: "p9c4", tipo: "M", creditos: 3, nombre: "Inglés B2", codigo: "900004", hilos: ["hilo10"] },
      { id: "p9c5", tipo: "P", creditos: 3, nombre: "Electivo Disciplinar Específico Línea 2" },
      { id: "p9c6", tipo: "T", creditos: 2, nombre: "Sociología rural", codigo: "30174" },
    ],
  },
  {
    id: "p10", numero: "X", creditos: 14,
    cursos: [
      { id: "p10c1", tipo: "P", creditos: 4, nombre: "Rotación One Health y Vigilancia Sanitaria", hilos: ["hilo8"] },
      { id: "p10c2", tipo: "P", creditos: 4, nombre: "Rotación de profundización", hilos: ["hilo8"] },
      { id: "p10c3", tipo: "M", creditos: 3, nombre: "Electivo IBC" },
      { id: "p10c4", tipo: "P", creditos: 3, nombre: "Electivo Disciplinar Específico Línea 3" },
    ],
  },
];

/* -------------------------------------------------------------------------
   Prerrequisitos manuales EXTRA (además de los que se calculan por color).
   Úsalo para forzar una relación puntual que no quede clara por hilos.
   Mapa: { idDelCurso: [idsDeSusPrerrequisitos] }
   ------------------------------------------------------------------------- */
const PREREQUISITOS_MANUALES = {
  // Ruta Blanca/Azul: One Health y Ética -> Bioética
  "p2c4": ["p1c4", "p1c7"], 
  // Ruta Verde: Biología celular -> Herramientas digitales
  "p2c5": ["p1c2"], 
  // Ruta Amarilla/Blanca: Biología desarrollo, Anatomía, Herramientas -> Inmunología, Semiología, Patología general
  "p3c1": ["p2c1", "p2c2", "p2c5"], 
  "p3c5": ["p2c1", "p2c2", "p2c5"], 
  "p3c7": ["p2c1", "p2c2", "p2c5"], 
  // Patología general es prerrequisito de Patología diagnóstica, Microbiología, Parasitología y Virología
  "p4c1": ["p3c7"], 
  "p4c2": ["p3c7"], 
  "p4c3": ["p3c7"], 
  "p4c7": ["p3c7"], 
  // Bioquímica es prerrequisito de Parasitología y Virología
  "p4c3": ["p3c7", "p2c3"], 
  "p4c7": ["p3c7", "p2c3"], 
  // Farmacología y Toxicología son prerrequisito de Cirugía y Medicina de rumiantes
  "p6c2": ["p5c1", "p5c3"], 
  "p6c3": ["p5c1", "p5c3"], 
  // Imagenología requiere Microbiología, Parasitología y Virología
  "p6c1": ["p4c2", "p4c3", "p4c7"], 
  // Medicina interna de pequeños y equinos requiere Medicina de rumiantes
  "p7c2": ["p6c3"], 
  "p7c3": ["p6c3"], 
  // Epidemiología requiere Etología y Patología diagnóstica
  "p5c6": ["p4c5", "p4c1"], 
  // Urgencias requiere Imagenología, Cirugía y Medicina de rumiantes
  "p7c1": ["p6c1", "p6c2", "p6c3"], 
  // Producción aviar y porcina requieren Farmacología y Toxicología
  "p7c6": ["p5c1", "p5c3"], 
  "p7c7": ["p5c1", "p5c3"], 
  // Biotecnologías requiere Genética
  "p5c5": ["p3c3"], 
  // Rotación Clínica requiere Urgencias, Med pequeños, Med Equinos
  "p8c1": ["p7c1", "p7c2", "p7c3"], 
  "p8c2": ["p7c1", "p7c2", "p7c3"], 
  // Rotación One Health requiere Rotación Clínica, Biotecnologías, Prod aviar y porcina
  "p10c1": ["p8c1", "p8c2", "p5c5", "p7c6", "p7c7"],
  // Rotación de profundización requiere las demás rotaciones
  "p10c2": ["p9c1", "p9c2", "p10c1"],
  // Servicio Social Unadista requiere Competencias Comunicativas (requisito administrativo)
  "p3c8": ["p1c6"],
  // Química -> Bioquímica -> Nutrición
  "p2c3": ["p1c3"],
  "p3c2": ["p2c3"],
  // Pensamiento lógico -> Transformación/Estadística
  "p3c6": ["p2c6"],
  "p3c4": ["p2c6"],
  // Ruta Naranja: Transformación/Estadística -> Diseño experimental y Fundamentos gestión
  "p4c4": ["p3c6", "p3c4"],
  "p4c6": ["p3c6", "p3c4"],
  // Ruta Naranja: Investigación y Diseño de proyectos
  "p5c2": ["p4c4", "p4c6"],
  "p5c4": ["p4c4", "p4c6"],
  // Trabajo de Grado requiere Investigación y Diseño de proyectos
  "p7c5": ["p5c2", "p5c4"],
  // Inglés
  "p7c4": ["p6c4"], // A1 -> A2
  "p8c4": ["p7c4"], // A2 -> B1
  "p9c4": ["p8c4"], // B1 -> B2
  // Rotaciones finales específicas
  "p9c2": ["p8c1", "p8c2", "p5c5"], // Biotecnologías -> Rotación Reproducción
  "p9c1": ["p8c1", "p8c2", "p7c6", "p7c7"], // Prod aviar/porcina -> Rotación Producción
};

/* -------------------------------------------------------------------------
   Deriva automáticamente el grafo de prerrequisitos a partir de `hilos`.
   Regla: para cada color, el prerrequisito de un curso es el ÚLTIMO curso
   (de un periodo anterior) que también usó ese mismo color de flecha.
   Un curso con dos colores converge dos hilos (requiere ambos).
   ------------------------------------------------------------------------- */
function derivarPrerequisitos(malla) {
  const prereqs = {};
  const ultimoPorHilo = {};

  malla.forEach((periodo) => {
    periodo.cursos.forEach((curso) => {
      const colores = curso.hilos || [];
      const reqs = new Set(PREREQUISITOS_MANUALES[curso.id] || []);
      
      colores.forEach((color) => {
        const anterior = ultimoPorHilo[color];
        if (anterior) reqs.add(anterior);
      });
      
      if (reqs.size) prereqs[curso.id] = [...reqs];
      
      // este curso pasa a ser el último representante de cada uno de sus hilos
      colores.forEach((color) => { ultimoPorHilo[color] = curso.id; });
    });
  });

  return prereqs;
}

const PREREQUISITOS = derivarPrerequisitos(MALLA);

// Exponer globalmente para malla.js
window.MALLA_DATA = { MALLA, PREREQUISITOS, TIPO_INFO, PERIODO_COLORES };