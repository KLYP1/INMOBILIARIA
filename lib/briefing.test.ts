import { test, describe } from "vitest";
import assert from "node:assert/strict";
import { briefingVisita } from "./briefing";
import { COORD, unLead, unaUnidad } from "./_fixtures";
import type { Unidad } from "./types";

/**
 * El briefing es lo unico que el asesor lee antes de que el cliente entre por
 * la puerta. Si miente sobre el precio o sugiere una unidad agotada, la visita
 * se cae en el primer minuto.
 */

/** Mirador, el proyecto de Magdalena, con las unidades que se le indiquen. */
function mirador(unidades: Unidad[] = [unaUnidad({ metraje: 65, precio: 462000, disponibles: 2 })]) {
  return {
    id: "mirador",
    nombre: "Mirador",
    distrito: "Magdalena del Mar",
    ...COORD.magdalena,
    etapa: "en_construccion" as const,
    unidades,
  };
}

/** Patricia, la del ejemplo: 2 dormitorios, hasta 520 mil, con credito. */
const patricia = (parcial: Parameters<typeof unLead>[0] = {}) =>
  unLead({
    nombre: "Patricia Bendezú",
    origen: "portal",
    proyectoInteres: "mirador",
    presupuestoMin: 480000,
    presupuestoMax: 520000,
    formaPago: "credito_hipotecario",
    dormitorios: 2,
    zonaSolicitada: "Magdalena del Mar",
    plazoMudanza: "inmediato",
    estado: "visita_agendada",
    score: 85,
    ...parcial,
  });

// 15:30 UTC son 10:30 en Lima, que no tiene horario de verano.
const A_LAS_1030 = "2026-09-25T15:30:00.000Z";

describe("briefingVisita", () => {
  test("abre diciendo quien llega, a que hora y donde", () => {
    const [primera] = briefingVisita(patricia(), mirador(), A_LAS_1030);
    assert.equal(primera, "Llega Patricia Bendezú a las 10:30 en Mirador.");
  });

  test("resume que busca en una sola frase", () => {
    const [, segunda] = briefingVisita(patricia(), mirador(), A_LAS_1030);
    assert.equal(
      segunda,
      "Busca 2 dormitorios, hasta S/ 520,000, y va con crédito hipotecario.",
    );
  });

  test("avisa de la objecion solo cuando hay una", () => {
    const sinObjecion = briefingVisita(patricia(), mirador(), A_LAS_1030);
    assert.ok(!sinObjecion.some((l) => l.includes("Espera objeción")));

    const conObjecion = briefingVisita(
      patricia({ objecion: "precio" }),
      mirador(),
      A_LAS_1030,
    );
    assert.ok(conObjecion.includes("Espera objeción de precio."));
  });

  /**
   * La regla de negocio del briefing: entre las que le calzan, la mas cara.
   * Sugerir la mas barata deja plata sobre la mesa en cada visita.
   */
  test("sugiere la unidad mas cara que entra en su presupuesto", () => {
    const conVarias = mirador([
      unaUnidad({ id: "a", metraje: 65, precio: 462000 }),
      unaUnidad({ id: "b", metraje: 72, precio: 510000 }),
      unaUnidad({ id: "c", metraje: 80, precio: 600000 }), // se pasa del maximo
    ]);
    const lineas = briefingVisita(patricia(), conVarias, A_LAS_1030);
    assert.ok(
      lineas.includes("Muéstrale el de 72 m² en S/ 510,000: es el que le calza."),
      `no sugirio la de 510 mil: ${JSON.stringify(lineas)}`,
    );
  });

  test("no sugiere una unidad agotada, aunque sea la mas cara que calza", () => {
    const conAgotada = mirador([
      unaUnidad({ id: "a", metraje: 65, precio: 462000, disponibles: 2 }),
      unaUnidad({ id: "b", metraje: 72, precio: 510000, disponibles: 0 }),
    ]);
    const lineas = briefingVisita(patricia(), conAgotada, A_LAS_1030);
    assert.ok(lineas.includes("Muéstrale el de 65 m² en S/ 462,000: es el que le calza."));
  });

  test("respeta los dormitorios que pidio", () => {
    const mixto = mirador([
      unaUnidad({ id: "a", dormitorios: 2, metraje: 65, precio: 462000 }),
      unaUnidad({ id: "b", dormitorios: 3, metraje: 92, precio: 515000 }),
    ]);
    const lineas = briefingVisita(patricia(), mixto, A_LAS_1030);
    assert.ok(lineas.includes("Muéstrale el de 65 m² en S/ 462,000: es el que le calza."));
  });

  test("si no declaro presupuesto, lo dice en vez de inventarlo", () => {
    const [, segunda] = briefingVisita(
      patricia({ presupuestoMin: 0, presupuestoMax: 0, formaPago: "no_definido" }),
      mirador(),
      A_LAS_1030,
    );
    assert.equal(
      segunda,
      "Busca 2 dormitorios, sin presupuesto declarado, y todavía no define cómo paga.",
    );
  });

  test("cuando nada del proyecto le entra, manda al asesor con una alternativa", () => {
    const fueraDeRango = mirador([unaUnidad({ precio: 900000 })]);
    const lineas = briefingVisita(
      patricia({ presupuestoMin: 300000, presupuestoMax: 400000 }),
      fueraDeRango,
      A_LAS_1030,
    );
    const ultima = lineas[lineas.length - 1];
    assert.ok(
      ultima.startsWith("Nada de este proyecto entra en su presupuesto."),
      `linea final inesperada: ${ultima}`,
    );
    assert.ok(!ultima.includes("Muéstrale"));
  });

  test("sin proyecto sigue produciendo un briefing utilizable", () => {
    const lineas = briefingVisita(patricia(), undefined, A_LAS_1030);
    assert.equal(lineas[0], "Llega Patricia Bendezú a las 10:30.");
    assert.ok(lineas.length >= 3);
  });
});
