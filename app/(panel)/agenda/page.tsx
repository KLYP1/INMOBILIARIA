import { PantallaAgenda } from "@/features/agenda/pantalla-agenda";
import { DIAS_AGENDA, DIA_INICIO_AGENDA } from "@/lib/data/visitas";
import { agendaSemana } from "@/lib/metricas";
import { claveDia, desdeHoy } from "@/lib/fechas";
import { visitasVista } from "@/lib/vistas";
import { obtenerDatos } from "@/lib/base/datos";

export default async function AgendaPage() {
  const datos = await obtenerDatos();
  const hoy = claveDia(desdeHoy(0));
  const dias = Array.from({ length: DIAS_AGENDA }, (_, i) => {
    const iso = desdeHoy(DIA_INICIO_AGENDA + i);
    return { clave: claveDia(iso), iso, esHoy: claveDia(iso) === hoy };
  });

  return (
    <PantallaAgenda
      dias={dias}
      visitas={visitasVista(datos)}
      resumen={agendaSemana(datos)}
    />
  );
}
