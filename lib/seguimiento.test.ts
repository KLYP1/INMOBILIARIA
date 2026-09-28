import { test, describe } from "vitest";
import assert from "node:assert/strict";
import { PLAZOS, cuandoSale, fechaSeguimiento, mensajeSeguimiento } from "./seguimiento";
import { hora, MS } from "./fechas";
import type { Objecion } from "./types";

/**
 * Este es el mensaje con el que se recupera a un cliente tibio, y sale fuera de
 * la ventana de 24 horas, o sea que cada envio se paga. Mas razon para que diga
 * algo distinto de lo que ya no funciono.
 */

function datos(parcial: Partial<Parameters<typeof mensajeSeguimiento>[0]> = {}) {
  return {
    nombre: "Carla Mendoza Rojas",
    proyectoNombre: "Altavista",
    dormitorios: 2 as number | null,
    objecion: null as Objecion,
    ...parcial,
  };
}

describe("mensajeSeguimiento", () => {
  test("tutea por el primer nombre, no por el nombre completo", () => {
    const texto = mensajeSeguimiento(datos());
    assert.ok(texto.startsWith("Hola Carla,"), texto);
    assert.ok(!texto.includes("Mendoza"));
  });

  test("nombra el departamento en prosa, sin la abreviatura de tabla", () => {
    const texto = mensajeSeguimiento(datos());
    assert.ok(texto.includes("el de 2 dormitorios en Altavista"), texto);
    assert.ok(!texto.includes("dorm."));
  });

  test("con un dormitorio lo dice en palabras", () => {
    const texto = mensajeSeguimiento(datos({ dormitorios: 1 }));
    assert.ok(texto.includes("el de un dormitorio en Altavista"), texto);
  });

  test("si nunca dijo cuantos dormitorios, no se lo inventa", () => {
    const texto = mensajeSeguimiento(datos({ dormitorios: null }));
    assert.ok(texto.includes("el departamento en Altavista"), texto);
    assert.ok(!texto.includes("dormitorio"));
  });

  test("sin objecion pregunta lo generico", () => {
    const texto = mensajeSeguimiento(datos());
    assert.ok(texto.includes("¿Sigues con la idea de mudarte"), texto);
  });

  /**
   * Lo que justifica el costo del envio: cada objecion recibe una respuesta
   * distinta. Si se agrega una variante a Objecion y nadie le escribe su
   * cierre, esta prueba lo delata en vez de dejarla caer en el generico.
   */
  describe("cada objecion tiene su propio cierre", () => {
    const CIERRES: Record<string, string> = {
      precio: "formas de pago",
      financiamiento: "dos bancos",
      ubicacion: "más cerca",
      metraje: "más grande",
      plazo_entrega: "fecha de entrega",
    };

    for (const [objecion, esperado] of Object.entries(CIERRES)) {
      test(objecion, () => {
        const texto = mensajeSeguimiento(datos({ objecion: objecion as Objecion }));
        assert.ok(
          texto.includes(esperado),
          `esperaba "${esperado}" para la objecion ${objecion}, obtuve: ${texto}`,
        );
        assert.ok(
          !texto.includes("¿Sigues con la idea"),
          `${objecion} cayo en el mensaje generico`,
        );
      });
    }
  });

  test("siempre termina preguntando algo: el objetivo es que contesten", () => {
    const todas: Objecion[] = [
      null,
      "precio",
      "financiamiento",
      "ubicacion",
      "metraje",
      "plazo_entrega",
    ];
    for (const objecion of todas) {
      assert.ok(
        mensajeSeguimiento(datos({ objecion })).trimEnd().endsWith("?"),
        `la objecion ${objecion} no termina en pregunta`,
      );
    }
  });
});

describe("fechaSeguimiento", () => {
  test("sale a las diez de la mañana, no a medianoche", () => {
    for (const plazo of PLAZOS) {
      assert.equal(hora(fechaSeguimiento(plazo.clave)), "10:00");
    }
  });

  test("los tres plazos estan separados como dicen estarlo", () => {
    const dia = (clave: (typeof PLAZOS)[number]["clave"]) =>
      new Date(fechaSeguimiento(clave)).getTime();

    assert.equal((dia("tres_dias") - dia("manana")) / MS.DIA, 2);
    assert.equal((dia("semana") - dia("manana")) / MS.DIA, 6);
  });

  test("cuandoSale se lee como fecha corta, no como ISO", () => {
    const texto = cuandoSale("manana");
    assert.ok(/^\d{1,2} [a-z]{3}$/.test(texto), `formato inesperado: ${texto}`);
  });
});
