import { PantallaAsistente } from "@/features/asistente/pantalla-asistente";
import { conversacionesPorCanal } from "@/lib/metricas";

export default function AsistentePage() {
  return <PantallaAsistente conteoCanales={conversacionesPorCanal()} />;
}
