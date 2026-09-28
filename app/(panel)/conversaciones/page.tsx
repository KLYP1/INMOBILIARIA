import { PantallaConversaciones } from "@/features/conversaciones/pantalla-conversaciones";
import { leadsVista } from "@/lib/vistas";
import { obtenerDatos } from "@/lib/base/datos";

export default async function ConversacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ chat?: string }>;
}) {
  const [{ chat }, datos] = await Promise.all([searchParams, obtenerDatos()]);
  const asesores = datos.asesores.map((a) => ({ id: a.id, nombre: a.nombre }));
  // Solo entran los leads que de verdad tienen transcripcion.
  const leads = leadsVista(datos).filter((l) => l.conversacion.length > 0);
  const existe = chat && leads.some((l) => l.id === chat);

  return (
    <PantallaConversaciones
      leads={leads}
      asesores={asesores}
      chatInicial={existe ? chat! : null}
    />
  );
}
