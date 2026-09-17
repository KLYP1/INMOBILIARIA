import { BarraProgreso } from "@/components/ui/barra-progreso";
import { Metrica } from "@/components/ui/metrica";
import { resumenCabecera } from "@/lib/metricas";

export function ResumenSuperior() {
  const r = resumenCabecera();

  return (
    <div className="flex flex-wrap items-end justify-between gap-6 lg:gap-8">
      <div className="grid w-full flex-1 grid-cols-3 gap-3 sm:w-auto sm:min-w-[440px] sm:gap-4">
        <BarraProgreso
          etiqueta="Leads captados"
          porcentaje={r.avanceMeta}
          tono="tinta"
        />
        <BarraProgreso
          etiqueta="Calificados"
          porcentaje={r.tasaCalificados}
          tono="ambar"
        />
        <BarraProgreso etiqueta="Agendados" porcentaje={r.tasaAgendadas} />
      </div>

      <div className="flex w-full justify-between gap-6 pb-1 sm:w-auto sm:justify-start sm:gap-10">
        <Metrica valor={`${r.leadsMes}`} etiqueta="Leads del mes" />
        <Metrica valor={`${r.calificados}`} etiqueta="Calificados" />
        <Metrica valor={`${r.agendadas}`} etiqueta="Visitas" />
      </div>
    </div>
  );
}
