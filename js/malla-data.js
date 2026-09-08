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
      { id: "p1c2", tipo: "M", creditos: 3, nombre: "Biología celular y molecular", codigo: "30176", hilos: ["verde", "azul"] },
      { id: "p1c3", tipo: "M", creditos: 3, nombre: "Química orgánica", codigo: "300047", hilos: ["azul"] },
      { id: "p1c4", tipo: "M", creditos: 3, nombre: "Fundamentos del enfoque One Health", hilos: ["blanco"] },
      { id: "p1c5", tipo: "M", creditos: 3, nombre: "Cátedra Unadista", codigo: "80017" },
      { id: "p1c6", tipo: "T", creditos: 3, nombre: "Competencias Comunicativas", codigo: "40003" },
      { id: "p1c7", tipo: "T", creditos: 3, nombre: "Ética y Ciudadanía (grado)", codigo: "400002", hilos: ["blanco"] },
    ],
  },
  {
    id: "p2", numero: "II", creditos: 19,
    cursos: [
      { id: "p2c1", tipo: "P", creditos: 4, nombre: "Anatomía Veterinaria comparada", hilos: ["amarillo"] },
      { id: "p2c2", tipo: "P", creditos: 2, nombre: "Biología del desarrollo y fisiología animal", hilos: ["verde", "amarillo"] },
      { id: "p2c3", tipo: "M", creditos: 3, nombre: "Bioquímica metabólica", codigo: "352001", hilos: ["negro", "azul"] },
      { id: "p2c4", tipo: "M", creditos: 3, nombre: "Bioética y legislación Veterinaria", hilos: ["blanco"] },
      { id: "p2c5", tipo: "T", creditos: 3, nombre: "Pensamiento lógico y matemático", codigo: "200611", hilos: ["naranja"] },
      { id: "p2c6", tipo: "M", creditos: 3, nombre: "Herramientas digitales para la gestión del conocimiento", codigo: "200610" },
    ],
  },
  {
    id: "p3", numero: "III", creditos: 17,
    cursos: [
      { id: "p3c1", tipo: "P", creditos: 3, nombre: "Inmunología" },
      { id: "p3c2", tipo: "M", creditos: 3, nombre: "Nutrición animal", codigo: "201110", hilos: ["azul"] },
      { id: "p3c3", tipo: "M", creditos: 3, nombre: "Genética", codigo: "201105", hilos: ["verde"] },
      { id: "p3c4", tipo: "T", creditos: 3, nombre: "Estadística Descriptiva Aplicada a las Ciencias Agrarias", codigo: "300032", hilos: ["naranja"] },
      { id: "p3c5", tipo: "P", creditos: 2, nombre: "Semiología y Competencias Clínicas Veterinarias", hilos: ["amarillo"] },
      { id: "p3c6", tipo: "M", creditos: 3, nombre: "Transformación Digital y Tecnologías Emergentes en Medicina Veterinaria", hilos: ["naranja"] },
      { id: "p3c7", tipo: "P", creditos: 2, nombre: "Prestación del Servicio Social Unadista", nota: "Requisito de grado", codigo: "700004" },
    ],
  },
  {
    id: "p4", numero: "IV", creditos: 17,
    cursos: [
      { id: "p4c1", tipo: "M", creditos: 3, nombre: "Inglés A1", codigo: "900001", hilos: ["rosa"] },
      { id: "p4c2", tipo: "P", creditos: 3, nombre: "Microbiología veterinaria", hilos: ["amarillo"] },
      { id: "p4c3", tipo: "M", creditos: 3, nombre: "Virología veterinaria", hilos: ["amarillo"] },
      { id: "p4c4", tipo: "P", creditos: 2, nombre: "Diseño experimental", codigo: "300004", hilos: ["naranja"] },
      { id: "p4c5", tipo: "P", creditos: 3, nombre: "Patología general y sistémica", hilos: ["amarillo"] },
      { id: "p4c6", tipo: "T", creditos: 2, nombre: "Mercadeo Agropecuario", codigo: "300005" },
      { id: "p4c7", tipo: "P", creditos: 2, nombre: "Parasitología veterinaria" },
    ],
  },
  {
    id: "p5", numero: "V", creditos: 17,
    cursos: [
      { id: "p5c1", tipo: "M", creditos: 3, nombre: "Inglés A2", codigo: "900002", hilos: ["violeta"] },
      { id: "p5c2", tipo: "P", creditos: 3, nombre: "Fundamentos y Generalidades de Investigación", codigo: "150001", hilos: ["naranja"] },
      { id: "p5c3", tipo: "P", creditos: 2, nombre: "Toxicología veterinaria", hilos: ["negro"] },
      { id: "p5c4", tipo: "M", creditos: 3, nombre: "Patología diagnóstica y de laboratorio clínico", hilos: ["amarillo"] },
      { id: "p5c5", tipo: "M", creditos: 3, nombre: "Farmacología veterinaria", hilos: ["negro"] },
      { id: "p5c6", tipo: "T", creditos: 3, nombre: "Diseño y evaluación de proyectos", codigo: "331005", hilos: ["naranja"] },
      { id: "p5c7", tipo: "T", creditos: 1, nombre: "Electiva campo de formación complementaria: Derechos de los animales", codigo: "300032" },
    ],
  },
  {
    id: "p6", numero: "VI", creditos: 20,
    cursos: [
      { id: "p6c1", tipo: "M", creditos: 3, nombre: "Inglés B1", codigo: "900003", hilos: ["rosa"] },
      { id: "p6c2", tipo: "P", creditos: 4, nombre: "Imagenología Veterinaria", hilos: ["amarillo"] },
      { id: "p6c3", tipo: "P", creditos: 4, nombre: "Cirugía", hilos: ["negro", "amarillo"] },
      { id: "p6c4", tipo: "P", creditos: 3, nombre: "Medicina interna de rumiantes", hilos: ["negro", "amarillo"] },
      { id: "p6c5", tipo: "P", creditos: 2, nombre: "Fundamentos y Fisiología Reproductiva", hilos: ["verde"] },
      { id: "p6c6", tipo: "M", creditos: 2, nombre: "Bienestar animal", codigo: "201570" },
      { id: "p6c7", tipo: "M", creditos: 3, nombre: "Electivo DC" },
    ],
  },
  {
    id: "p7", numero: "VII", creditos: 17,
    cursos: [
      { id: "p7c1", tipo: "P", creditos: 3, nombre: "Medicina y Producción Acuícola" },
      { id: "p7c2", tipo: "P", creditos: 4, nombre: "Prácticas clínicas integradas I", hilos: ["negro", "amarillo"] },
      { id: "p7c3", tipo: "P", creditos: 3, nombre: "Medicina interna de pequeños animales", hilos: ["negro", "amarillo"] },
      { id: "p7c4", tipo: "P", creditos: 2, nombre: "Epidemiología y salud pública Veterinaria", hilos: ["amarillo", "blanco"] },
      { id: "p7c5", tipo: "P", creditos: 3, nombre: "Medicina Interna en Equinos", hilos: ["negro", "amarillo"] },
      { id: "p7c6", tipo: "T", creditos: 2, nombre: "Trabajo de Grado", codigo: "204015", hilos: ["naranja"] },
      { id: "p7c7", tipo: "T", creditos: 1, nombre: "Electivo de formación complementaria" },
    ],
  },
  {
    id: "p8", numero: "VIII", creditos: 16,
    cursos: [
      { id: "p8c1", tipo: "P", creditos: 4, nombre: "Prácticas clínicas integradas II", hilos: ["negro"] },
      { id: "p8c2", tipo: "P", creditos: 3, nombre: "Medicina de urgencias y cuidados intensivos", hilos: ["negro", "amarillo"] },
      { id: "p8c3", tipo: "P", creditos: 2, nombre: "Medicina de fauna silvestre y exótica", hilos: ["negro"] },
      { id: "p8c4", tipo: "P", creditos: 2, nombre: "Medicina y producción aviar", hilos: ["negro"] },
      { id: "p8c5", tipo: "P", creditos: 2, nombre: "Medicina Interna de porcinos", hilos: ["negro"] },
      { id: "p8c6", tipo: "P", creditos: 3, nombre: "Biotecnologías y Manejo Reproductivo", hilos: ["verde"] },
      { id: "p8c7", tipo: "P", creditos: 3, nombre: "Electivo Disciplinar Específico Línea 1" },
    ],
  },
  {
    id: "p9", numero: "IX", creditos: 17,
    cursos: [
      { id: "p9c1", tipo: "P", creditos: 4, nombre: "Rotaciones clínicas I", hilos: ["negro", "amarillo"] },
      { id: "p9c2", tipo: "M", creditos: 1, nombre: "Salud de hato y gestión sanitaria", hilos: ["blanco"] },
      { id: "p9c3", tipo: "T", creditos: 2, nombre: "Electivo de formación complementaria" },
      { id: "p9c4", tipo: "T", creditos: 3, nombre: "Sociología rural", codigo: "30174" },
      { id: "p9c5", tipo: "P", creditos: 3, nombre: "Electivo Disciplinar Específico Línea 2" },
      { id: "p9c6", tipo: "M", creditos: 3, nombre: "Electivo IBC" },
      { id: "p9c7", tipo: "M", creditos: 2, nombre: "Electivo DC" },
    ],
  },
  {
    id: "p10", numero: "X", creditos: 10,
    cursos: [
      { id: "p10c1", tipo: "P", creditos: 4, nombre: "Rotaciones clínicas II", hilos: ["negro", "amarillo"] },
      { id: "p10c2", tipo: "M", creditos: 3, nombre: "Electivo Disciplinar Específico Línea 3" },
      { id: "p10c3", tipo: "M", creditos: 3, nombre: "Electivo IBC" },
    ],
  },
];

/* -------------------------------------------------------------------------
   Prerrequisitos manuales EXTRA (además de los que se calculan por color).
   Úsalo para forzar una relación puntual que no quede clara por hilos.
   Mapa: { idDelCurso: [idsDeSusPrerrequisitos] }
   ------------------------------------------------------------------------- */
const PREREQUISITOS_MANUALES = {
  "p3c7": ["p1c6"], // Servicio Social Unadista requiere Competencias Comunicativas (requisito administrativo)
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
