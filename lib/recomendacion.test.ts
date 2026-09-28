import { test, describe } from "vitest";
import assert from "node:assert/strict";
import {
  haversine,
  recomendarPorCercania,
  sinOfertaEnZona,
} from "./recomendacion";
import { COORD, proyectoEn, unaUnidad } from "./_fixtures";

/**
 * Esto es lo que evita perder al que pide un distrito donde no hay proyecto, y
 * es el argumento de venta de tener varios. Su comportamiento se fija aqui.
 */

const QUIERE_MIRAFLORES = {
  zonaSolicitada: "Miraflores",
  presupuestoMin: 400000,
  presupuestoMax: 500000,
  dormitorios: 2,
};

describe("haversine", () => {
  test("la distancia de un punto a si mismo es cero", () => {
    assert.equal(haversine(COORD.surco.lat, COORD.surco.lng, COORD.surco.lat, COORD.surco.lng), 0);
  });

  test("Miraflores y Barranco estan a unos 3 km", () => {
    const km = haversine(
      COORD.miraflores.lat,
      COORD.miraflores.lng,
      COORD.barranco.lat,
      COORD.barranco.lng,
    );
    assert.ok(km > 2 && km < 4, `esperaba entre 2 y 4 km, obtuve ${km}`);
  });
});

describe("sinOfertaEnZona", () => {
  test("verdadero cuando ningun proyecto esta en el distrito pedido", () => {
    assert.equal(
      sinOfertaEnZona({ zonaSolicitada: "Miraflores" }, [
        proyectoEn("Santiago de Surco", COORD.surco),
      ]),
      true,
    );
  });

  test("falso cuando si hay proyecto en el distrito pedido", () => {
    assert.equal(
      sinOfertaEnZona({ zonaSolicitada: "Santiago de Surco" }, [
        proyectoEn("Santiago de Surco", COORD.surco),
      ]),
      false,
    );
  });
});

describe("recomendarPorCercania", () => {
  test("un distrito que no esta en el mapa no devuelve nada", () => {
    assert.deepEqual(
      recomendarPorCercania(
        { ...QUIERE_MIRAFLORES, zonaSolicitada: "Nueva York" },
        [proyectoEn("surco", COORD.surco)],
      ),
      [],
    );
  });

  test("ordena de mas cerca a mas lejos del distrito pedido", () => {
    const alternativas = recomendarPorCercania(QUIERE_MIRAFLORES, [
      proyectoEn("surco", COORD.surco),
      proyectoEn("barranco", COORD.barranco),
    ]);
    assert.deepEqual(
      alternativas.map((a) => a.proyecto.id),
      ["barranco", "surco"],
    );
  });

  test("descarta el proyecto sin ninguna unidad que le sirva", () => {
    const caro = proyectoEn("caro", COORD.barranco, [unaUnidad({ precio: 900000 })]);
    const alternativas = recomendarPorCercania(QUIERE_MIRAFLORES, [
      caro,
      proyectoEn("surco", COORD.surco),
    ]);
    assert.deepEqual(
      alternativas.map((a) => a.proyecto.id),
      ["surco"],
    );
  });

  test("desde es el precio mas bajo que le calza, no el del proyecto", () => {
    const variado = proyectoEn("variado", COORD.barranco, [
      unaUnidad({ id: "a", precio: 420000 }),
      unaUnidad({ id: "b", precio: 480000 }),
      unaUnidad({ id: "c", precio: 900000 }), // fuera de presupuesto
    ]);
    const [alternativa] = recomendarPorCercania(QUIERE_MIRAFLORES, [variado]);
    assert.equal(alternativa.desde, 420000);
  });

  test("unidadesEnRango suma las disponibles, no los tipos", () => {
    const variado = proyectoEn("variado", COORD.barranco, [
      unaUnidad({ id: "a", precio: 420000, disponibles: 4 }),
      unaUnidad({ id: "b", precio: 480000, disponibles: 3 }),
    ]);
    const [alternativa] = recomendarPorCercania(QUIERE_MIRAFLORES, [variado]);
    assert.equal(alternativa.unidadesEnRango, 7);
  });

  test("exige que los dormitorios calcen exactamente", () => {
    const soloDeTres = proyectoEn("tres", COORD.barranco, [
      unaUnidad({ dormitorios: 3, precio: 480000 }),
    ]);
    assert.deepEqual(recomendarPorCercania(QUIERE_MIRAFLORES, [soloDeTres]), []);
  });

  test("si el lead no dijo cuantos dormitorios, cualquiera sirve", () => {
    const soloDeTres = proyectoEn("tres", COORD.barranco, [
      unaUnidad({ dormitorios: 3, precio: 480000 }),
    ]);
    const alternativas = recomendarPorCercania(
      { ...QUIERE_MIRAFLORES, dormitorios: null },
      [soloDeTres],
    );
    assert.equal(alternativas.length, 1);
  });

  /**
   * Diferencia deliberada con alcanzaPresupuesto() de scoring.ts, que si aplica
   * un piso del 85 % del minimo. Son dos preguntas distintas: aquella responde
   * "hay algo para esta persona", que es calificacion; esta responde "que le
   * puedo mostrar", y un departamento mas barato de lo que pensaba gastar si se
   * le puede mostrar. Colapsarlas empeoraria las dos.
   */
  test("no aplica piso por debajo del minimo: un depa mas barato si se ofrece", () => {
    const barato = proyectoEn("barato", COORD.barranco, [unaUnidad({ precio: 200000 })]);
    const [alternativa] = recomendarPorCercania(QUIERE_MIRAFLORES, [barato]);
    assert.equal(alternativa.desde, 200000);
  });
});
