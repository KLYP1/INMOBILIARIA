import type { Mensaje } from "../../types";
import { PARTE_1 } from "./parte-1";
import { PARTE_2 } from "./parte-2";
import { PARTE_3 } from "./parte-3";

/** Transcripciones completas de WhatsApp, indexadas por id de lead. */
export const CONVERSACIONES: Record<string, Mensaje[]> = {
  ...PARTE_1,
  ...PARTE_2,
  ...PARTE_3,
};
