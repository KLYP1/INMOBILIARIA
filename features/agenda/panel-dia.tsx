import { Tarjeta, TituloTarjeta } from "@/components/ui/tarjeta";
import { Pildora } from "@/components/ui/pildora";
import { COLOR_VISITA } from "./estados-visita";
import { etiqueta } from "@/lib/formato";
import { fechaLarga, hora } from "@/lib/fechas";
import type { VisitaVista } from "@/lib/vistas";

const TONO_PILDORA = {
  confirmada: "ambar",
  pendiente_confirmacion: "borde",
  asistio: "exito",
  no_asistio: "peligro",
  reprogramada: "aviso",
} as const;

export function PanelDia({
  iso,
  visitas,
  onAbrir,
}: {
  iso: string;
  visitas: VisitaVista[];
  onAbrir: (id: string) => void;
}) {
  return (
    <Tarjeta className="p-5">
      <TituloTarjeta
        accion={
          <span className="text-[11px] text-tenue">
            {visitas.length} {visitas.length === 1 ? "visita" : "visitas"}
          </span>
        }
      >
        {fechaLarga(iso)}
      </TituloTarjeta>

      {visitas.length === 0 ? (
        <p className="mt-6 text-[13px] text-suave">
          Sin visitas este día. Los leads calificados sin asesor son el mejor
          lugar para llenarlo.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {visitas.map((visita) => (
            <li key={visita.id} className="rounded-[10px] bg-elevado p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] tabular-nums text-tenue">
                    {hora(visita.fechaHora)}
                  </p>
                  <button
                    type="button"
                    onClick={() => onAbrir(visita.id)}
                    className="mt-1 block max-w-full truncate text-left text-[14px] transition-colors duration-200 hover:text-suave"
                  >
                    {visita.leadNombre}
                  </button>
                </div>
                <Pildora tono={TONO_PILDORA[visita.estado]}>
                  {etiqueta(visita.estado)}
                </Pildora>
              </div>
              <p className="mt-3 text-[12px] text-suave">
                {visita.proyectoNombre}
              </p>
              <p className="mt-0.5 text-[11px] text-tenue">
                Atiende {visita.asesorNombre}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-borde pt-4">
        {(
          [
            ["confirmada", "Confirmada"],
            ["pendiente_confirmacion", "Por confirmar"],
            ["asistio", "Asistió"],
            ["no_asistio", "No asistió"],
            ["reprogramada", "Reprogramada"],
          ] as const
        ).map(([clave, texto]) => (
          <span key={clave} className="flex items-center gap-1.5 text-[11px] text-tenue">
            <span className={`size-2.5 rounded-full ${COLOR_VISITA[clave]}`} />
            {texto}
          </span>
        ))}
      </div>
    </Tarjeta>
  );
}
