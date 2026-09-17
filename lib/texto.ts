/** "Álvaro" -> "alvaro". Nadie escribe tildes en un buscador. */
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function contiene(texto: string, busqueda: string): boolean {
  return normalizar(texto).includes(normalizar(busqueda));
}

/** plural(1, "pregunta", "preguntas") -> "1 pregunta" */
export function plural(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`;
}
