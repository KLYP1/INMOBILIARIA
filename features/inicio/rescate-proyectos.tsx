import { Tarjeta, TituloTarjeta } from "@/components/ui/tarjeta";
import { leadsRescatados } from "@/lib/metricas";
import { TICKET_PROMEDIO } from "@/lib/data/empresa";
import { solesMillonesPiso } from "@/lib/formato";
import { plural } from "@/lib/texto";

/** La cara buena de la demanda no atendida: lo que el asistente sí salvó. */
export function RescateProyectos() {
  const rescatados = leadsRescatados();
  const distritos = [...new Set(rescatados.map((l) => l.zonaSolicitada))];
  const valor = rescatados.length * TICKET_PROMEDIO;

  return (
    <Tarjeta className="flex flex-col p-6">
      <TituloTarjeta>Rescate entre proyectos</TituloTarjeta>

      <p className="mt-5 text-[30px] leading-none font-normal tabular-nums text-ambar">
        {rescatados.length}
      </p>
      <p className="mt-3 text-[13px] text-texto">
        {plural(rescatados.length, "lead pidió", "leads pidieron")}{" "}
        {distritos.slice(0, -1).join(", ")}
        {distritos.length > 1 ? " o " : ""}
        {distritos.at(-1)}, donde no tienes proyecto, y{" "}
        {rescatados.length === 1 ? "terminó" : "terminaron"} interesados en otro.
      </p>

      <p className="mt-auto pt-6 text-[13px] text-suave">
        {solesMillonesPiso(valor)} que se perdían por no tener stock en el
        distrito que pidieron.
      </p>
    </Tarjeta>
  );
}
