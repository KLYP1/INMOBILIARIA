import { PantallaAsistente } from "@/features/asistente/pantalla-asistente";
import { conversacionesPorCanal } from "@/lib/metricas";
import { obtenerDatos } from "@/lib/base/datos";

export default async function AsistentePage() {
  const datos = await obtenerDatos();
  return <PantallaAsistente conteoCanales={conversacionesPorCanal(datos)} />;
}
