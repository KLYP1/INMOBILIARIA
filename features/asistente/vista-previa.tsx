import { Tarjeta } from "@/components/ui/tarjeta";
import { SALUDOS, type ConfigAsistente } from "@/lib/data/asistente";
import { plural } from "@/lib/texto";

/** La unica tarjeta negra de esta pantalla: el asistente hablando. */
export function VistaPrevia({ config }: { config: ConfigAsistente }) {
  const activas = config.preguntas.filter((p) => p.activa);
  // Sin nombre la frase quedaria como "Hola, soy de Grupo Vertiente".
  const nombre = config.nombre.trim() || "el asistente";
  const horario =
    config.horaInicio && config.horaFin
      ? `${config.horaInicio} a ${config.horaFin}`
      : "Sin definir";
  const { nocheAnterior, dosHorasAntes } = config.confirmacion;
  const confirma =
    nocheAnterior && dosHorasAntes
      ? "Noche antes y 2 h antes"
      : nocheAnterior
        ? "La noche antes"
        : dosHorasAntes
          ? "2 h antes"
          : "No confirma";

  return (
    <Tarjeta oscura className="sticky top-5 p-5">
      <p className="text-[14px] font-medium">Así saluda ahora</p>
      <p className="mt-1 text-[11px] text-tinta-tenue">
        Igual en los tres canales
      </p>

      <div className="mt-5 space-y-2.5">
        <div className="max-w-[88%] rounded-[14px] bg-elevado px-3.5 py-2.5 text-texto">
          <p className="text-[13px] leading-relaxed">
            Hola, vi el anuncio de Altavista
          </p>
          <p className="mt-1 text-[10px] text-tenue tabular-nums">09:12</p>
        </div>

        <div className="ml-auto max-w-[88%] rounded-[14px] border border-tinta-borde px-3.5 py-2.5">
          <p className="text-[13px] leading-relaxed">
            {SALUDOS[config.tono](nombre)}
          </p>
          <p className="mt-1 text-[10px] text-tinta-tenue tabular-nums">09:12</p>
        </div>
      </div>

      <dl className="mt-6 space-y-3 border-t border-tinta-borde pt-5 text-[12px]">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-tinta-tenue">Atiende</dt>
          <dd className="tabular-nums">{horario}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-tinta-tenue">Pregunta</dt>
          <dd className="tabular-nums">
            {activas.length === 0
              ? "Nada"
              : plural(activas.length, "dato", "datos")}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-tinta-tenue">Deriva a un asesor</dt>
          <dd className="tabular-nums">desde {config.umbral} puntos</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-tinta-tenue">Confirma visitas</dt>
          <dd>{confirma}</dd>
        </div>
      </dl>
    </Tarjeta>
  );
}
