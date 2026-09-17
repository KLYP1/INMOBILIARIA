import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  /** Evita que Turbopack tome la raiz del home del usuario como raiz del proyecto. */
  turbopack: { root: path.resolve(".") },
  /** El indicador flotante de desarrollo estorba en las capturas de la demo. */
  devIndicators: false,
};

export default nextConfig;
