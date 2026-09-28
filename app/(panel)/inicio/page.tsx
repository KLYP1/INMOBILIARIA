import { BandaAlerta } from "@/features/inicio/banda-alerta";
import { ResumenSuperior } from "@/features/inicio/resumen-superior";
import { VisitasHoy } from "@/features/inicio/visitas-hoy";
import { TiempoRespuesta } from "@/features/inicio/tiempo-respuesta";
import { LeadsRecientes } from "@/features/inicio/leads-recientes";
import { GraficoSemanas } from "@/features/inicio/grafico-semanas";
import { DonaDistritos } from "@/features/inicio/dona-distritos";
import { DemandaNoAtendida } from "@/features/inicio/demanda-no-atendida";
import { RescateProyectos } from "@/features/inicio/rescate-proyectos";
import { InformeSemanal } from "@/features/informe/informe-semanal";
import { EMPRESA } from "@/lib/data/empresa";
import { obtenerDatos } from "@/lib/base/datos";
import { distritosPedidos, informeSemanal, leadsPorSemana } from "@/lib/metricas";
import { fechaLarga, hoy } from "@/lib/fechas";

export default async function Inicio() {
  const datos = await obtenerDatos();
  const fechaDeHoy = fechaLarga(new Date(hoy()).toISOString());
  const dona = distritosPedidos(datos);
  const recientes = datos.leads.slice(0, 12).map((l) => ({
    id: l.id,
    nombre: l.nombre,
    presupuestoMin: l.presupuestoMin,
    presupuestoMax: l.presupuestoMax,
    estado: l.estado,
    proyecto:
      datos.proyectos.find((p) => p.id === l.proyectoInteres)?.nombre ??
      "Sin proyecto",
  }));

  return (
    <div className="space-y-5">
      <div className="pt-2 pb-1">
        <h1 className="text-[27px] leading-tight font-normal">
          Hola, {EMPRESA.usuaria.saludo}
        </h1>
        <p className="mt-1.5 text-[13px] text-tenue">{fechaDeHoy}</p>
      </div>

      <ResumenSuperior />

      <BandaAlerta />

      <div className="grid gap-5 lg:grid-cols-[26fr_48fr_26fr]">
        <VisitasHoy />
        <LeadsRecientes leads={recientes} />
        <TiempoRespuesta />
      </div>

      <div className="grid gap-5 lg:grid-cols-[64fr_36fr]">
        <GraficoSemanas datos={leadsPorSemana(datos)} />
        <DonaDistritos partes={dona.partes} total={dona.total} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[64fr_36fr]">
        <DemandaNoAtendida />
        <RescateProyectos />
      </div>

      <InformeSemanal informe={informeSemanal(datos)} />
    </div>
  );
}
