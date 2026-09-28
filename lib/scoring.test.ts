import { test, describe } from "vitest";
import assert from "node:assert/strict";
import { UMBRAL, alcanzaPresupuesto, calcularScore, semaforo } from "./scoring";
import { CONFIG_INICIAL } from "./data/asistente";
import { unLeadCrudo, unProyecto, unaUnidad } from "./_fixtures";
import type { LeadCrudo } from "./types";

/**
 * El score decide a quien llama primero el equipo comercial, asi que su
 * comportamiento se fija aqui antes de mover los datos a una base. Si una de
 * estas pruebas cambia, cambia a quien se atiende primero.
 */

const RANGO = { presupuestoMin: 400000, presupuestoMax: 500000 };

/** Un proyecto cuya unica unidad cuesta lo que se le indique. */
const conPrecio = (precio: number, disponibles = 1) =>
  unProyecto({ unidades: [unaUnidad({ precio, disponibles })] });

describe("alcanzaPresupuesto", () => {
  test("sin presupuesto maximo declarado no puede alcanzar nada", () => {
    assert.equal(
      alcanzaPresupuesto({ presupuestoMin: 0, presupuestoMax: 0 }, [unProyecto()]),
      false,
    );
  });

  test("una unidad dentro del rango y disponible alcanza", () => {
    assert.equal(alcanzaPresupuesto(RANGO, [unProyecto()]), true);
  });

  test("una unidad agotada no cuenta, aunque el precio calce", () => {
    assert.equal(alcanzaPresupuesto(RANGO, [conPrecio(450000, 0)]), false);
  });

  test("por encima del maximo no alcanza", () => {
    assert.equal(
      alcanzaPresupuesto({ presupuestoMin: 400000, presupuestoMax: 440000 }, [
        unProyecto(),
      ]),
      false,
    );
  });

  /**
   * El piso del 85 % del minimo es deliberado: a quien busca entre 400 y 500
   * mil no se le cuenta como match un estudio de 200 mil. La tolerancia existe
   * para no descartar por poco, no para ofrecer cualquier cosa.
   */
  describe("el piso del 85 % del minimo", () => {
    test("justo en el piso, alcanza", () => {
      assert.equal(alcanzaPresupuesto(RANGO, [conPrecio(340000)]), true);
    });

    test("un sol por debajo del piso, no alcanza", () => {
      assert.equal(alcanzaPresupuesto(RANGO, [conPrecio(339999)]), false);
    });
  });

  test("ignora los dormitorios a proposito: responde si hay algo, no si calza", () => {
    const soloDeTres = unProyecto({
      unidades: [unaUnidad({ dormitorios: 3, precio: 480000 })],
    });
    assert.equal(alcanzaPresupuesto(RANGO, [soloDeTres]), true);
  });
});

describe("calcularScore", () => {
  test("el maximo declarable es 100", () => {
    const completo = unLeadCrudo({
      ...RANGO,
      formaPago: "contado",
      plazoMudanza: "inmediato",
      zonaSolicitada: "Santiago de Surco",
      dormitorios: 2,
    });
    assert.equal(calcularScore(completo, [unProyecto()]), 100);
  });

  test("quien no declara nada y solo explora saca 3", () => {
    // Los 3 puntos son de "solo_explorando": haber escrito ya vale algo.
    assert.equal(calcularScore(unLeadCrudo(), [unProyecto()]), 3);
  });

  test("declarar el rango de presupuesto vale 25", () => {
    const base = calcularScore(unLeadCrudo(), []);
    assert.equal(calcularScore(unLeadCrudo(RANGO), []) - base, 25);
  });

  test("la forma de pago ordena de contado a indefinido", () => {
    const con = (formaPago: LeadCrudo["formaPago"]) =>
      calcularScore(unLeadCrudo({ formaPago }), []);
    assert.equal(con("contado") - con("no_definido"), 20);
    assert.equal(con("credito_hipotecario") - con("no_definido"), 18);
    assert.equal(con("mivivienda") - con("no_definido"), 15);
  });

  test("el plazo de mudanza es el componente que mas pesa", () => {
    const con = (plazoMudanza: LeadCrudo["plazoMudanza"]) =>
      calcularScore(unLeadCrudo({ plazoMudanza }), []);
    assert.equal(con("inmediato") - con("solo_explorando"), 22);
    assert.equal(con("3_6_meses") - con("solo_explorando"), 15);
    assert.equal(con("6_12_meses") - con("solo_explorando"), 7);
  });

  test("zona y dormitorios suman 15, pero solo juntos", () => {
    const base = calcularScore(unLeadCrudo(), []);
    assert.equal(calcularScore(unLeadCrudo({ zonaSolicitada: "Barranco" }), []), base);
    assert.equal(calcularScore(unLeadCrudo({ dormitorios: 2 }), []), base);
    assert.equal(
      calcularScore(
        unLeadCrudo({ zonaSolicitada: "Barranco", dormitorios: 2 }),
        [],
      ) - base,
      15,
    );
  });

  test("tener stock para el lead suma 15 sin que el lead haga nada", () => {
    const conRango = unLeadCrudo(RANGO);
    assert.equal(
      calcularScore(conRango, [unProyecto()]) - calcularScore(conRango, []),
      15,
    );
  });
});

describe("semaforo", () => {
  test("los cortes estan en 70 y 40", () => {
    assert.equal(semaforo(70), "calificado");
    assert.equal(semaforo(69), "en_conversacion");
    assert.equal(semaforo(40), "en_conversacion");
    assert.equal(semaforo(39), "frio");
  });

  test("los extremos caen donde deben", () => {
    assert.equal(semaforo(0), "frio");
    assert.equal(semaforo(100), "calificado");
  });

  test("los cortes salen de UMBRAL, no de numeros sueltos", () => {
    assert.equal(semaforo(UMBRAL.calificado), "calificado");
    assert.equal(semaforo(UMBRAL.calificado - 1), "en_conversacion");
    assert.equal(semaforo(UMBRAL.enConversacion), "en_conversacion");
    assert.equal(semaforo(UMBRAL.enConversacion - 1), "frio");
  });

  /**
   * El bot escala al humano en config.umbral y el panel pinta el semaforo en
   * UMBRAL.calificado. Si se separan, el panel dice una cosa y el bot hace otra.
   */
  test("el umbral de escalamiento del Asistente coincide con el del semaforo", () => {
    assert.equal(CONFIG_INICIAL.umbral, UMBRAL.calificado);
    assert.equal(semaforo(CONFIG_INICIAL.umbral), "calificado");
  });
});
