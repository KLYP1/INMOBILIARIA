import { afterEach, describe, test, vi } from "vitest";
import assert from "node:assert/strict";
import { ahora, claveDia, desdeHoy, esHoy, hoy, relativo } from "./fechas";

/**
 * Estas pruebas existen por un error real: HOY y AHORA eran constantes de
 * modulo, calculadas una sola vez al importar. Un servidor levantado el viernes
 * seguia creyendo que era viernes el lunes siguiente, y la agenda del dia salia
 * vacia sin que nada fallara a la vista. Fueron tres dias hasta que se noto.
 */

afterEach(() => {
  vi.useRealTimers();
});

/** Lima no tiene horario de verano: 05:00 UTC es medianoche del mismo dia. */
function enLima(iso: string) {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(iso));
}

describe("hoy", () => {
  test("es la medianoche de Lima del dia en curso", () => {
    enLima("2026-09-28T15:30:00.000Z"); // 10:30 en Lima
    assert.equal(new Date(hoy()).toISOString(), "2026-09-28T05:00:00.000Z");
  });

  /** El corte del dia es a medianoche de Lima, no de UTC. */
  test("a las 20:00 de Lima sigue siendo el mismo dia", () => {
    enLima("2026-09-29T01:00:00.000Z"); // 20:00 del 28 en Lima
    assert.equal(claveDia(new Date(hoy()).toISOString()), "2026-09-28");
  });

  /**
   * La prueba que protege el error: si vuelve a ser una constante de modulo,
   * el segundo valor sera igual al primero y esto falla.
   */
  test("sigue al reloj cuando el proceso lleva dias encendido", () => {
    enLima("2026-09-25T18:00:00.000Z");
    const viernes = hoy();

    vi.setSystemTime(new Date("2026-09-28T18:00:00.000Z"));
    const lunes = hoy();

    assert.notEqual(
      viernes,
      lunes,
      "hoy() quedo congelado: un servidor de varios dias mostraria la agenda equivocada",
    );
    assert.equal(claveDia(new Date(lunes).toISOString()), "2026-09-28");
  });
});

describe("ahora", () => {
  test("trunca al minuto para que los segundos no hagan bailar el texto", () => {
    enLima("2026-09-28T15:30:47.500Z");
    assert.equal(new Date(ahora()).toISOString(), "2026-09-28T15:30:00.000Z");
  });

  test("tambien sigue al reloj", () => {
    enLima("2026-09-28T15:00:00.000Z");
    const antes = ahora();
    vi.setSystemTime(new Date("2026-09-28T16:00:00.000Z"));
    assert.equal(ahora() - antes, 3_600_000);
  });
});

describe("desdeHoy y esHoy", () => {
  test("desdeHoy construye sobre la medianoche de hoy", () => {
    enLima("2026-09-28T15:30:00.000Z");
    assert.equal(desdeHoy(0, 10, 30), "2026-09-28T15:30:00.000Z");
    assert.equal(claveDia(desdeHoy(1)), "2026-09-29");
    assert.equal(claveDia(desdeHoy(-1)), "2026-09-27");
  });

  test("esHoy distingue el dia de Lima, no las 24 horas previas", () => {
    enLima("2026-09-28T15:30:00.000Z");
    assert.equal(esHoy(desdeHoy(0, 23, 59)), true);
    assert.equal(esHoy(desdeHoy(-1, 23, 59)), false);
  });
});

describe("relativo", () => {
  test("cuenta hacia atras desde el reloj real", () => {
    enLima("2026-09-28T15:30:00.000Z");
    assert.equal(relativo("2026-09-28T15:30:00.000Z"), "recién");
    assert.equal(relativo("2026-09-28T15:10:00.000Z"), "hace 20 min");
    assert.equal(relativo("2026-09-28T12:30:00.000Z"), "hace 3 h");
    assert.equal(relativo("2026-09-27T12:30:00.000Z"), "ayer");
    assert.equal(relativo("2026-09-24T12:30:00.000Z"), "hace 4 d");
  });
});
