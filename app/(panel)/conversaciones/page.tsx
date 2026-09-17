import { PantallaConversaciones } from "@/features/conversaciones/pantalla-conversaciones";
import { leadsVista } from "@/lib/vistas";

export default async function ConversacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ chat?: string }>;
}) {
  const { chat } = await searchParams;
  // Solo entran los leads que de verdad tienen transcripcion.
  const leads = leadsVista().filter((l) => l.conversacion.length > 0);
  const existe = chat && leads.some((l) => l.id === chat);

  return (
    <PantallaConversaciones
      leads={leads}
      chatInicial={existe ? chat! : null}
    />
  );
}
